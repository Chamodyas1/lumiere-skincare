import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  X,
  ShoppingCart,
  RefreshCw,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/products';

const INGREDIENT_RULES = [
  {
    names: ['salicylic acid', 'bha'],
    concerns: ['Acne', 'Uneven texture'],
    reason: 'May help unclog pores and improve acne-prone skin.',
    caution: 'May cause dryness or irritation, particularly with frequent use.',
  },
  {
    names: ['benzoyl peroxide'],
    concerns: ['Acne'],
    reason: 'Can help treat acne-causing bacteria.',
    caution: 'May cause dryness, irritation, and bleaching of fabrics.',
  },
  {
    names: ['niacinamide'],
    concerns: ['Acne', 'Dark spots', 'Redness', 'Uneven texture'],
    reason: 'May support the skin barrier and improve the appearance of uneven skin tone.',
    caution: 'Some people experience irritation depending on concentration and formulation.',
  },
  {
    names: ['retinol', 'retinaldehyde', 'retinal', 'adapalene', 'tretinoin'],
    concerns: ['Acne', 'Dark spots', 'Fine lines', 'Uneven texture'],
    reason: 'Some retinoids can help with acne, uneven texture, or signs of photoaging.',
    caution: 'May cause dryness, peeling, or irritation. Avoid retinoids during pregnancy unless specifically advised by a clinician.',
  },
  {
    names: ['glycolic acid', 'lactic acid', 'mandelic acid', 'aha'],
    concerns: ['Dark spots', 'Uneven texture', 'Fine lines'],
    reason: 'Exfoliating acids may improve uneven texture and the appearance of dark marks.',
    caution: 'May cause irritation and increase sensitivity to sunlight.',
  },
  {
    names: ['ascorbic acid', 'vitamin c'],
    concerns: ['Dark spots', 'Fine lines'],
    reason: 'Vitamin C may help improve the appearance of uneven skin tone.',
    caution: 'Some formulations may sting or irritate sensitive skin.',
  },
  {
    names: ['hyaluronic acid', 'glycerin', 'ceramide', 'squalane', 'panthenol'],
    concerns: ['Dryness'],
    reason: 'May help hydrate skin or support the skin barrier.',
    caution: '',
  },
  {
    names: ['petrolatum', 'urea', 'shea butter'],
    concerns: ['Dryness'],
    reason: 'Can help moisturize skin and reduce moisture loss, depending on the formulation.',
    caution: '',
  },
  {
    names: ['azelaic acid'],
    concerns: ['Acne', 'Dark spots', 'Redness', 'Uneven texture'],
    reason: 'May help with acne and the appearance of dark marks or redness.',
    caution: 'May cause stinging, dryness, or irritation.',
  },
  {
    names: ['allantoin', 'centella asiatica', 'madecassoside'],
    concerns: ['Redness'],
    reason: 'Often used in soothing skincare formulations.',
    caution: 'Individual reactions are still possible.',
  },
  {
    names: ['fragrance', 'parfum', 'essential oil', 'menthol'],
    concerns: [],
    reason: '',
    caution: 'May irritate some sensitive skin. Not everyone will react.',
  },
  {
    names: ['alcohol denat.', 'denatured alcohol'],
    concerns: [],
    reason: '',
    caution: 'May be drying or irritating in some formulations. The overall formula matters.',
  },
];

const SKIN_TYPES = [
  'Oily',
  'Dry',
  'Combination',
  'Normal',
  'Sensitive',
];

const SKIN_CONCERNS = [
  'Acne',
  'Dark spots',
  'Dryness',
  'Redness',
  'Fine lines',
  'Uneven texture',
  'General maintenance',
];

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .trim();

const getId = (product) =>
  String(product?._id ?? product?.id ?? '');

const getName = (product) =>
  product?.name || product?.title || 'Skincare Product';

const getPrice = (product) =>
  Number(product?.price ?? product?.salePrice ?? 0);

const getImage = (product) =>
  product?.image || product?.images?.[0] || '';

const getCategory = (product) => {
  const category = product?.category || product?.type || '';
  return String(category || 'Not specified')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getSkinTypes = (product) => {
  const value =
    product?.skinType ??
    product?.skinTypes ??
    product?.suitableFor ??
    [];

  if (Array.isArray(value)) return value.map(String);

  if (typeof value === 'string' && value.trim()) {
    return value.split(/[,;\n]+/).map((item) => item.trim());
  }

  return [];
};

const getIngredientList = (product) => {
  const value =
    product?.ingredients ??
    product?.ingredientList ??
    product?.keyIngredients ??
    [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getIngredients = (product) =>
  getIngredientList(product).join(', ');

const getBenefits = (product) => {
  const value = product?.benefits || product?.description || '';

  if (Array.isArray(value)) return value.join(', ');
  return String(value || '');
};

const extractProducts = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.products)) return responseData.products;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.data?.products)) {
    return responseData.data.products;
  }
  if (Array.isArray(responseData?.results)) return responseData.results;
  return [];
};

const analyzeProduct = ({
  product,
  skinType,
  skinConcern,
  sensitiveSkin,
}) => {
  const ingredients = getIngredientList(product);
  const sensitive = sensitiveSkin || skinType === 'Sensitive';

  if (ingredients.length === 0) {
    return {
      status: 'Insufficient information',
      color: '#8a6d3b',
      results: [],
      summary: 'The ingredient list is missing. A reliable ingredient check is not possible.',
      typeNotice: '',
    };
  }

  const results = ingredients.map((ingredient) => {
    const text = normalize(ingredient);

    const rule = INGREDIENT_RULES.find((item) =>
      item.names.some((name) => {
        const term = normalize(name);
        return text === term || text.includes(term);
      })
    );

    if (!rule) {
      return {
        ingredient,
        matched: false,
        concerns: [],
        reason: 'No matching rule is available for this ingredient.',
        caution: '',
      };
    }

    return {
      ingredient,
      matched: true,
      concerns: rule.concerns,
      reason: rule.reason,
      caution: rule.caution,
    };
  });
    const hasCaution = results.some((item) => item.caution);
  const hasHelpful = results.some((item) =>
    item.concerns.includes(skinConcern)
  );
  const hasUnknown = results.some((item) => !item.matched);

  const declaredTypes = getSkinTypes(product).map(normalize);
  const typeSpecified = declaredTypes.length > 0;
  const selectedType = normalize(skinType);

  const typeMatch =
    !typeSpecified ||
    declaredTypes.some((type) => type === selectedType);

  let status = 'Partial information available';
  let color = '#8a6d3b';
  let summary =
    'Some ingredients are recognized, but there is not enough information to determine overall compatibility.';

  if (hasCaution) {
    status = 'Review ingredients carefully';
    color = '#a85b46';
    summary =
      'One or more ingredients may require extra care. Review the reasons below.';
  } else if (hasHelpful && !hasUnknown) {
    status = 'Potentially relevant to your concern';
    color = '#397454';
    summary =
      'Some ingredients may help with your selected concern. This does not guarantee the whole product will suit your skin.';
  }

  let typeNotice = '';

  if (typeSpecified && !typeMatch) {
    typeNotice =
      'This product does not list your selected skin type among its declared suitable skin types. Review the product information before using it.';
  } else if (!typeSpecified) {
    typeNotice =
      'The product does not specify suitable skin types, so this information cannot be confirmed.';
  }

  return {
    status,
    color,
    results,
    summary,
    typeNotice,
  };
};

const ProductComparison = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedProducts, setSelectedProducts] = useState(['', '']);
  const [skinType, setSkinType] = useState('Oily');
  const [skinConcern, setSkinConcern] = useState('Acne');
  const [sensitiveSkin, setSensitiveSkin] = useState(false);
  const [routineIngredients, setRoutineIngredients] = useState('');
  const [routineChecked, setRoutineChecked] = useState(false);

  const selected = useMemo(
    () =>
      selectedProducts.map(
        (id) => products.find((product) => getId(product) === id) || null
      ),
    [products, selectedProducts]
  );

  const chooseProduct = (index, id) => {
    setSelectedProducts((previous) =>
      previous.map((value, i) => (i === index ? id : value))

    );
  };
  


useEffect(() => {
  let active = true;

  const loadProducts = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Product API returned ${response.status}`);
      }

      const data = await response.json();
      const apiProducts = extractProducts(data);

      if (!Array.isArray(apiProducts) || apiProducts.length === 0) {
        throw new Error('No products were returned by MongoDB API.');
      }

      if (active) {
        setProducts(apiProducts);
        setLoadError('');
      }
    } catch (error) {
      if (active) {
        setProducts([]);
        setLoadError(
          `Could not load MongoDB products: ${error.message}`
        );
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  loadProducts();

  return () => {
    active = false;
  };
}, []);



  const compareRows = [
    {
      label: 'Price',
      value: (product) =>
        `LKR ${getPrice(product).toLocaleString()}`,
    },
    {
      label: 'Category',
      value: getCategory,
    },
    {
      label: 'Suitable skin types',
      value: (product) =>
        getSkinTypes(product).join(', ') || 'Not specified',
    },
    {
      label: 'Ingredients',
      value: (product) =>
        getIngredients(product) || 'Not provided',
    },
    {
      label: 'Benefits',
      value: (product) =>
        getBenefits(product) || 'Not provided',
    },
  ];

 
const addToCart = (product) => {
  if (!product) return;

  if (!user) {
    window.alert("Please login to add products to your cart.");
    return;
  }

  if (user.role === "admin" || user.role === "super_admin") {
    window.alert("Admin accounts cannot use the shopping cart.");
    return;
  }

  const cartKey = user._id
    ? `cart_${user._id}`
    : user.id
      ? `cart_${user.id}`
      : user.email
        ? `cart_${user.email.toLowerCase()}`
        : null;

  if (!cartKey) {
    window.alert("Unable to identify your shopping cart. Please login again.");
    return;
  }

  try {
    const savedCart = JSON.parse(
      localStorage.getItem(cartKey) || "[]"
    );

    const currentCart = Array.isArray(savedCart)
      ? savedCart
      : [];

    const productId = String(getId(product));

    if (!productId || productId === "undefined") {
      window.alert("Unable to identify this product.");
      return;
    }

    const existingIndex = currentCart.findIndex(
      (item) => String(item.id) === productId
    );

    if (existingIndex >= 0) {
      const existingItem = currentCart[existingIndex];
      const stock = Number(existingItem.stock) || 999;
      const quantity = Number(existingItem.quantity) || 1;

      if (quantity >= stock) {
        window.alert("Maximum available stock reached.");
        return;
      }

      currentCart[existingIndex] = {
        ...existingItem,
        quantity: quantity + 1,
      };
    } else {
      currentCart.push({
        ...product,
        id: productId,
        name: getName(product),
        price: getPrice(product),
        image: getImage(product),
        quantity: 1,
      });
    }

    localStorage.setItem(
      cartKey,
      JSON.stringify(currentCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
    window.alert(`${getName(product)} added to cart!`);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    window.alert("Unable to update cart. Please try again.");
  }
};


  const checkRoutine = (product) => {
    const ingredients = getIngredientList(product);

    if (!ingredients.length) {
      return 'This product has no saved ingredient list. Routine compatibility cannot be checked.';
    }

    if (!routineIngredients.trim()) {
      return 'Enter the active ingredients in your current routine to check for possible overlaps.';
    }

    const currentIngredients = routineIngredients
      .split(/[,;\n]+/)
      .map((item) => normalize(item))
      .filter(Boolean);

    const actives = [
      'retinol',
      'retinal',
      'tretinoin',
      'adapalene',
      'benzoyl peroxide',
      'salicylic acid',
      'glycolic acid',
      'lactic acid',
      'mandelic acid',
      'ascorbic acid',
      'vitamin c',
      'azelaic acid',
    ];

    const productText = normalize(
      ingredients.join(', ')
    );

    const productActives = actives.filter((active) =>
      productText.includes(normalize(active))
    );

    const overlapping = currentIngredients.filter((current) =>
      productActives.some(
        (active) =>
          current.includes(active) ||
          active.includes(current)
      )
    );

    if (overlapping.length) {
      return `Possible active ingredient overlap: ${[
        ...new Set(overlapping),
      ].join(', ')}. This does not automatically mean the combination is unsafe. Consider the formulations, frequency, and product directions.`;
    }

    return 'No obvious overlap was found among the listed actives. This does not confirm that every combination is safe.';
  };
    return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fcf8f5',
        color: '#1e2b2b',
        padding: '32px 5%',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <style>{`
        .pc-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pc-hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 32px;
          align-items: center;
          margin-bottom: 36px;
          padding: 32px;
          border-radius: 24px;
          background: #f1e6dc;
          overflow: hidden;
        }

        .pc-hero h1 {
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.15;
          margin: 12px 0;
          color: #1e2b2b;
        }

        .pc-hero p {
          color: #62564f;
          line-height: 1.7;
        }

        .pc-hero img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 18px;
        }

        .pc-eyebrow {
          color: #9b7155;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .pc-card {
          background: #fff;
          border: 1px solid #eaded4;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 5px 20px rgba(30, 43, 43, 0.04);
        }

        .pc-card h2 {
          margin: 0 0 16px;
          font-size: 22px;
        }

        .pc-muted {
          color: #746a63;
          line-height: 1.6;
          font-size: 14px;
        }

        .pc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .pc-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .pc-field select,
        .pc-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 12px;
          border: 1px solid #dfcfc1;
          border-radius: 10px;
          background: #fff;
          color: #1e2b2b;
          font: inherit;
          outline-color: #b48b6a;
        }

        .pc-checkbox {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 18px;
          font-size: 14px;
        }

        .pc-concern-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .pc-concern {
          background: #fff;
          border: 1px solid #eaded4;
          border-radius: 14px;
          overflow: hidden;
        }

        .pc-concern img {
          width: 100%;
          height: 145px;
          object-fit: cover;
          display: block;
        }

        .pc-concern h3 {
          font-size: 14px;
          margin: 12px;
          line-height: 1.5;
        }

        .pc-product-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .pc-product-select {
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 16px;
          padding: 12px;
          border: 1px solid #dfcfc1;
          border-radius: 10px;
          background: white;
          font: inherit;
        }

        .pc-product-image {
          width: 100%;
          height: 230px;
          object-fit: contain;
          background: #fcf8f5;
          border-radius: 12px;
          margin-bottom: 14px;
        }

        .pc-product-name {
          font-size: 19px;
          font-weight: 700;
          margin: 8px 0;
        }

        .pc-price {
          color: #9b7155;
          font-size: 20px;
          font-weight: 700;
          margin: 8px 0 16px;
        }

        .pc-button {
          border: 0;
          border-radius: 10px;
          padding: 12px 16px;
          background: #b48b6a;
          color: white;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .pc-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pc-button:hover {
  background: #967052;
}

.pc-button:active {
  background: #7d5c43;
  transform: scale(0.98);
  transition: 0.15s ease;
}
        .pc-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .pc-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 520px;
        }

        
.pc-table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #eee2d8;
  border-radius: 12px;
}

.pc-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  table-layout: fixed;
}

.pc-table th,
.pc-table td {
  padding: 16px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid #eee2d8;
  line-height: 1.7;
  font-size: 14px;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}

.pc-table th {
  background: #f7eee7;
}

.pc-table th:first-child {
  width: 150px;
}

.pc-table th:nth-child(2),
.pc-table th:nth-child(3),
.pc-table td:nth-child(2),
.pc-table td:nth-child(3) {
  width: 265px;
}

@media (max-width: 760px) {
  .pc-table {
    min-width: 680px;
  }

  .pc-table th,
  .pc-table td {
    padding: 12px;
    font-size: 13px;
  }
}


        .pc-table th {
          background: #f7eee7;
        }

        .pc-table th:first-child {
          width: 180px;
        }

        .pc-status {
          padding: 14px;
          border-radius: 12px;
          background: #fcf8f5;
          margin: 12px 0;
          line-height: 1.7;
        }

        .pc-tag {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          background: #f1e6dc;
          color: #76543d;
          font-size: 12px;
          margin: 3px;
        }

        .pc-ingredient {
          border-bottom: 1px solid #eee2d8;
          padding: 14px 0;
          line-height: 1.7;
        }

        .pc-ingredient:last-child {
          border-bottom: 0;
        }

        .pc-ingredient h4 {
          margin: 0 0 6px;
        }

        .pc-warning {
          color: #a85b46;
        }

        .pc-success {
          color: #397454;
        }

        .pc-empty {
          padding: 24px;
          text-align: center;
          border: 1px dashed #d8c5b5;
          border-radius: 12px;
          color: #746a63;
          line-height: 1.7;
        }

        @media (max-width: 760px) {
          .pc-hero {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .pc-hero img {
            height: 220px;
          }

          .pc-grid,
          .pc-product-grid {
            grid-template-columns: 1fr;
          }

          .pc-concern-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pc-card {
            padding: 18px;
          }
        }
      `}</style>

      <div className="pc-container">
        <section className="pc-hero">
          <div>
            <span className="pc-eyebrow">
              Lumière Skincare
            </span>

            <h1>
              Find the right skincare for your skin
            </h1>

            <p>
              Compare products, explore ingredients, and
              understand which skincare options may suit
              your skin type and concerns.
            </p>

            <span className="pc-tag">
              Product Comparison
            </span>

            <span className="pc-tag">
              Ingredient Insights
            </span>
          </div>

          <img
            src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80"
            alt="Skincare products arranged for a skincare routine"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </section>

        <section className="pc-card">
          <h2>Your skin profile</h2>

          <p className="pc-muted">
            Select your skin type and main concern to
            personalize the ingredient information shown below.
          </p>

          <div className="pc-grid">
            <label className="pc-field">
              Skin type

              <select
                value={skinType}
                onChange={(event) =>
                  setSkinType(event.target.value)
                }
              >
                {SKIN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="pc-field">
              Main skin concern

              <select
                value={skinConcern}
                onChange={(event) =>
                  setSkinConcern(event.target.value)
                }
              >
                {SKIN_CONCERNS.map((concern) => (
                  <option key={concern} value={concern}>
                    {concern}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <label className="pc-checkbox">
                <input
                  type="checkbox"
                  checked={sensitiveSkin}
                  onChange={(event) =>
                    setSensitiveSkin(event.target.checked)
                  }
                />

                My skin is sensitive
              </label>
            </div>
          </div>
        </section>
                <section className="pc-card">
          <h2>Explore skin concerns</h2>

          <p className="pc-muted">
            Learn about common skin types and concerns before
            choosing your skincare products.
          </p>

          <div className="pc-concern-grid">
            <article className="pc-concern">
              <img
                src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=80"
                alt="Skincare products for oily skin"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <h3>Oily & acne-prone skin</h3>
            </article>

            <article className="pc-concern">
              <img
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80"
                alt="Moisturizing skincare products"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <h3>Dry & dehydrated skin</h3>
            </article>

            <article className="pc-concern">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
                alt="Facial skincare treatment"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <h3>Dark spots & uneven tone</h3>
            </article>

            <article className="pc-concern">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
                alt="Gentle skincare products"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <h3>Sensitive & redness-prone skin</h3>
            </article>
          </div>
        </section>

        <section className="pc-card">
          <h2>Compare your products</h2>

          <p className="pc-muted">
            Choose two products to compare their prices,
            ingredients, benefits, and suitability information.
          </p>

          {loading ? (
            <div className="pc-empty">
              <RefreshCw
                size={22}
                style={{ marginBottom: 8 }}
              />

              <p>Loading skincare products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="pc-empty">
              <p>
                No products are available to compare right now.
              </p>

              <p>
                Check whether your backend is running and
                products are available in MongoDB or local storage.
              </p>
            </div>
          ) : (
            <>
              {loadError && (
                <div className="pc-status">
                  <AlertTriangle
                    size={18}
                    style={{
                      display: 'inline',
                      verticalAlign: 'middle',
                      marginRight: 8,
                    }}
                  />

                  {loadError}
                </div>
              )}

              <div className="pc-product-grid">
                {[0, 1].map((index) => {
                  const product = selected[index];

                  return (
                    <article
                      className="pc-card"
                      key={`comparison-${index}`}
                      style={{ marginBottom: 0 }}
                    >
                      <label className="pc-field">
                        {index === 0
                          ? 'First product'
                          : 'Second product'}

                        <select
                          className="pc-product-select"
                          value={selectedProducts[index]}
                          onChange={(event) =>
                            chooseProduct(
                              index,
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            Select a skincare product
                          </option>

                          {products.map((item, itemIndex) => (
                            <option
                              key={
                                getId(item) ||
                                `${getName(item)}-${itemIndex}`
                              }
                              value={getId(item)}
                              disabled={
                                selectedProducts[1 - index] ===
                                  getId(item) &&
                                Boolean(getId(item))
                              }
                            >
                              {getName(item)}
                            </option>
                          ))}
                        </select>
                      </label>

                      {product ? (
                        <>
                          {getImage(product) && (
                            <img
                              className="pc-product-image"
                              src={getImage(product)}
                              alt={getName(product)}
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  'none';
                              }}
                            />
                          )}

                          <div className="pc-eyebrow">
                            {getCategory(product)}
                          </div>

                          <h3 className="pc-product-name">
                            {getName(product)}
                          </h3>

                          <p className="pc-price">
                            LKR {getPrice(product).toLocaleString()}
                          </p>

                          <button
                            type="button"
                            className="pc-button"
style={{ transition: 'background 0.3s ease, transform 0.15s ease' }}
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart size={17} />
                            Add to Cart
                          </button>
                        </>
                      ) : (
                        <div className="pc-empty">
                          Select a product to see its details.
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="pc-card">
          <h2>
            <ArrowLeftRight
              size={22}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                marginRight: 8,
              }}
            />
            Product comparison table
          </h2>

          {!selected[0] || !selected[1] ? (
            <div className="pc-empty">
              Select both products above to compare them.
            </div>
          ) : (
            <div className="pc-table-wrap">
              <table className="pc-table">
                <thead>
                  <tr>
                    <th>Feature</th>

                    <th>{getName(selected[0])}</th>

                    <th>{getName(selected[1])}</th>
                  </tr>
                </thead>

                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.label}>
                      <th>{row.label}</th>

                      <td>{row.value(selected[0])}</td>

                      <td>{row.value(selected[1])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
                <section className="pc-card">
          <h2>
            <ShieldCheck
              size={22}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                marginRight: 8,
              }}
            />
            Ingredient compatibility checker
          </h2>

          <p className="pc-muted">
            Review the listed ingredients for potential benefits
            and cautions related to your selected skin concern.
            This is a general information tool, not a medical diagnosis.
          </p>

          {!selected[0] && !selected[1] ? (
            <div className="pc-empty">
              Select at least one product above to analyze its
              ingredients.
            </div>
          ) : (
            <div className="pc-product-grid">
              {selected.map((product, index) => {
                if (!product) {
                  return (
                    <div
                      className="pc-empty"
                      key={`analysis-empty-${index}`}
                    >
                      Select product {index + 1} to see its
                      ingredient analysis.
                    </div>
                  );
                }

                const analysis = analyzeProduct({
                  product,
                  skinType,
                  skinConcern,
                  sensitiveSkin,
                });

                return (
                  <article
                    className="pc-card"
                    key={`analysis-${getId(product)}`}
                    style={{ marginBottom: 0 }}
                  >
                    <h3>{getName(product)}</h3>

                    <div
                      className="pc-status"
                      style={{
                        borderLeft: `4px solid ${analysis.color}`,
                      }}
                    >
                      <strong style={{ color: analysis.color }}>
                        {analysis.status}
                      </strong>

                      <p>{analysis.summary}</p>
                    </div>

                    {analysis.typeNotice && (
                      <div className="pc-status pc-warning">
                        <AlertTriangle
                          size={17}
                          style={{
                            display: 'inline',
                            verticalAlign: 'middle',
                            marginRight: 6,
                          }}
                        />

                        {analysis.typeNotice}
                      </div>
                    )}

                    <h4>Ingredient details</h4>

                    {analysis.results.map((item, itemIndex) => (
                      <div
                        className="pc-ingredient"
                        key={`${item.ingredient}-${itemIndex}`}
                      >
                        <h4>{item.ingredient}</h4>

                        {item.matched ? (
                          <>
                            {item.reason && (
                              <p className="pc-muted">
                                <CheckCircle2
                                  size={15}
                                  style={{
                                    display: 'inline',
                                    verticalAlign: 'middle',
                                    marginRight: 5,
                                  }}
                                />

                                {item.reason}
                              </p>
                            )}

                            {item.concerns.length > 0 && (
                              <div>
                                {item.concerns.map((concern) => (
                                  <span
                                    className="pc-tag"
                                    key={concern}
                                  >
                                    {concern}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.caution && (
                              <p className="pc-warning">
                                <AlertTriangle
                                  size={15}
                                  style={{
                                    display: 'inline',
                                    verticalAlign: 'middle',
                                    marginRight: 5,
                                  }}
                                />

                                {item.caution}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="pc-muted">
                            No specific rule is available for this
                            ingredient in the current checker.
                          </p>
                        )}
                      </div>
                    ))}

                    {sensitiveSkin && (
                      <div className="pc-status">
                        <Sparkles
                          size={17}
                          style={{
                            display: 'inline',
                            verticalAlign: 'middle',
                            marginRight: 6,
                          }}
                        />

                        Because you selected sensitive skin, introduce
                        new products carefully and patch test first.
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        
<section className="pc-card">
  <h2>Routine active ingredient checker</h2>

  <p className="pc-muted">
    Enter the active ingredients in your existing skincare
    routine, separated by commas. Select a product above
    and check for possible ingredient overlaps.
  </p>

  <label className="pc-field">
    Ingredients in your current routine

    <textarea
      rows={4}
      value={routineIngredients}
      onChange={(event) => {
        setRoutineIngredients(event.target.value);
        setRoutineChecked(false);
      }}
      placeholder="Example: retinol, salicylic acid, vitamin C"
    />
  </label>

  <button
    type="button"
    className="pc-button"
    style={{ marginTop: 16 }}
    onClick={() => setRoutineChecked(true)}
  >
    <ShieldCheck size={17} />
    Check Compatibility
  </button>

  {routineChecked && (
    <div style={{ marginTop: 20 }}>
      {!routineIngredients.trim() ? (
        <div className="pc-status pc-warning">
          Please enter the active ingredients in your current
          skincare routine first.
        </div>
      ) : !selected[0] && !selected[1] ? (
        <div className="pc-status pc-warning">
          Please select at least one product above to check
          its routine compatibility.
        </div>
      ) : (
        <div className="pc-product-grid">
          {selected.map((product, index) => (
            <div
              className="pc-status"
              key={`routine-result-${index}`}
            >
              <h3>
                {product
                  ? getName(product)
                  : `Product ${index + 1}`}
              </h3>

              <p>
                {product
                  ? checkRoutine(product)
                  : 'Select a product above to check its ingredients.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</section>

        <footer
          style={{
            textAlign: 'center',
            padding: '20px 0',
            color: '#746a63',
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          <p>
            Lumière Skincare · Product Comparison
          </p>

          <p>
            Ingredient checks provide general information only.
            Always review product labels and follow professional
            advice when needed.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ProductComparison;