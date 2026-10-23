
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const SYSTEM_INSTRUCTION = `
You are Lumi, the friendly AI skincare assistant for Lumiere Skincare.

GENERAL KNOWLEDGE:
- Answer general skincare questions using your available knowledge.
- Explain acne, dark spots, oily skin, dry skin, sensitive skin,
  ingredients, skincare routines, sunscreen and product use.
- Answer general questions even when they are unrelated to the store.
- Reply in the same language as the latest user message.
- Support Sinhala, English, Tamil and mixed-language messages.
- Keep answers clear, helpful and concise.

STORE PRODUCTS:
- Use the VERIFIED PRODUCT CATALOG supplied with each request.
- Recommend only products present in that catalog.
- Never invent store product names, prices, ingredients, benefits or stock.
- Recommend only products shown in the catalog as in stock.
- Use actual catalog prices.
- Explain why a product may suit the user's needs without guaranteeing results.
- If the catalog is empty, explain that no in-stock products are available to recommend.
- If product data is unavailable, be honest about that.
- Never confuse general skincare knowledge with verified store inventory.

SKINCARE SAFETY:
- Give general information, not medical diagnoses.
- Never promise that a product will cure a condition.
- Do not prescribe medication.
- Recommend a qualified healthcare professional for severe or persistent
  acne, painful swelling, or serious skin reactions.
- For breathing difficulty or swelling of the tongue or throat,
  advise emergency medical care.
- Recommend patch testing and gradual introduction of new products.
- Explain that sunscreen helps protect against UV damage.
- Never request passwords, API keys or other sensitive information.

CONVERSATION:
- Use recent conversation history when relevant.
- Ask a follow-up question if important details are missing.
- Use Markdown formatting when helpful.
`;

router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Check GEMINI_API_KEY.',
      });
    }

    const { message, history = [] } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message.',
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: 'Your message is too long. Use fewer than 4000 characters.',
      });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat history.',
      });
    }

    const safeHistory = history
      .slice(-10)
      .filter(
        (item) =>
          item &&
          ['user', 'model'].includes(item.role) &&
          typeof item.text === 'string' &&
          item.text.trim()
      )
      .map((item) => ({
        role: item.role,
        parts: [{ text: item.text.slice(0, 2000) }],
      }));

    // Retrieve verified products from MongoDB.
    let productCatalog = [];
    let catalogAvailable = true;

    try {
      productCatalog = await Product.find({ stock: { $gt: 0 } })
        .select(
          'name category price originalPrice description ingredients benefits howToUse skinType stock rating discountPercentage isActive'
        )
        .sort({ isBestSeller: -1, salesCount: -1, name: 1 })
        .limit(40)
        .lean();

      // Exclude inactive products if the schema uses isActive.
      productCatalog = productCatalog.filter(
        (product) => product.isActive !== false
      );
    } catch (error) {
      catalogAvailable = false;
      console.error('Product Catalog Error:', error.message);
    }

    const catalogText = catalogAvailable
      ? JSON.stringify(
          productCatalog.map((product) => ({
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice ?? null,
            description: product.description || '',
            ingredients: product.ingredients || [],
            benefits: product.benefits || [],
            howToUse: product.howToUse || '',
            skinType: product.skinType || [],
            stock: product.stock,
            rating: product.rating ?? null,
            discountPercentage: product.discountPercentage ?? 0,
          }))
        )
      : 'Product database unavailable. Do not make claims about store inventory or prices.';

    const productContext = `
VERIFIED PRODUCT CATALOG:
${catalogText}

Use the catalog only for Lumiere store product facts.
General skincare questions can still be answered using your knowledge.
`;

    const { GoogleGenAI } = await import('@google/genai');

    const ai = new GoogleGenAI({ apiKey });

    // Set GEMINI_MODEL in backend/.env to a model available to your API key.
    const configuredModel =
      process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    // These are fallback candidates, not a guarantee of availability.
    const modelCandidates = [
      ...new Set([
        configuredModel,
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
      ]),
    ];

    const contents = [
      ...safeHistory,
      {
        role: 'user',
        parts: [
          {
            text: `${productContext}\n\nLATEST USER MESSAGE:\n${message.trim()}`,
          },
        ],
      },
    ];

    let response = null;
    let lastError = null;

    for (const modelName of modelCandidates) {
      try {
        console.log(`Trying Lumi AI model: ${modelName}`);

        response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            maxOutputTokens: 1500,
          },
        });

        if (
          typeof response.text === 'string' &&
          response.text.trim()
        ) {
          console.log(`Lumi AI success: ${modelName}`);
          break;
        }

        response = null;
        throw new Error(`Empty response from model: ${modelName}`);
      } catch (error) {
        lastError = error;
        response = null;

        console.error(
          `Lumi AI model failed: ${modelName}`,
          error.status || error.message
        );

        const retryableStatuses = [429, 500, 502, 503, 504];

        // Do not try fallback models for authentication or other
        // non-temporary errors.
        if (
          error.status &&
          !retryableStatuses.includes(error.status)
        ) {
          break;
        }
      }
    }

    if (
      !response ||
      typeof response.text !== 'string' ||
      !response.text.trim()
    ) {
      console.error(
        'All Lumi AI model attempts failed:',
        lastError?.message || 'No response'
      );

      return res.status(503).json({
        success: false,
        message:
          'Lumi AI is temporarily unavailable. Please try again shortly.',
      });
    }

    return res.status(200).json({
      success: true,
      reply: response.text.trim(),
    });
  } catch (error) {
    console.error('========== LUMI AI ERROR ==========');
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('===================================');

    return res.status(500).json({
      success: false,
      message: 'Lumi AI request failed. Please check the backend terminal.',
    });
  }
});

module.exports = router;
