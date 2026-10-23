
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const routines = {
  Oily: {
    en: {
      name: 'Oily Skin',
      description: 'A lightweight routine to help manage excess oil.',
      morning: [
        'Gentle foaming cleanser',
        'Lightweight, non-comedogenic moisturizer',
        'Broad-spectrum sunscreen SPF 30–50',
      ],
      night: [
        'Gentle cleanser',
        'Lightweight moisturizer',
      ],
      tips: [
        'Avoid washing your face too frequently.',
        'Do not skip moisturizer, even if your skin is oily.',
        'Introduce new products one at a time.',
      ],
    },
    si: {
      name: 'තෙල් සහිත සම',
      description: 'අමතර තෙල් ගතිය පාලනයට උපකාරී වන සරල routine එකක්.',
      morning: [
        'මෘදු foaming cleanser එකක්',
        'සැහැල්ලු moisturizer එකක්',
        'SPF 30–50 broad-spectrum sunscreen එකක්',
      ],
      night: [
        'මෘදු cleanser එකක්',
        'සැහැල්ලු moisturizer එකක්',
      ],
      tips: [
        'මුහුණ අධිකව සෝදන්න එපා.',
        'තෙල් සහිත සමක් වුණත් moisturizer භාවිතා කරන්න.',
        'අලුත් products එකින් එක හඳුන්වා දෙන්න.',
      ],
    },
  },
  Dry: {
    en: {
      name: 'Dry Skin',
      description: 'A moisture-focused routine to support your skin barrier.',
      morning: [
        'Gentle hydrating cleanser',
        'Cream-based moisturizer',
        'Broad-spectrum sunscreen SPF 30–50',
      ],
      night: [
        'Gentle cleanser',
        'Rich moisturizer',
      ],
      tips: [
        'Avoid very hot water.',
        'Consider fragrance-free products.',
        'Avoid harsh scrubs if your skin is dry or flaky.',
      ],
    },
    si: {
      name: 'වියළි සම',
      description: 'සමේ තෙතමනය ආරක්ෂා කිරීමට උපකාරී වන routine එකක්.',
      morning: [
        'මෘදු hydrating cleanser එකක්',
        'cream-based moisturizer එකක්',
        'SPF 30–50 sunscreen එකක්',
      ],
      night: [
        'මෘදු cleanser එකක්',
        'සමට ගැළපෙන moisturizer එකක්',
      ],
      tips: [
        'ඉතා උණුසුම් ජලයෙන් මුහුණ සෝදන්න එපා.',
        'සුවඳ ද්‍රව්‍ය අඩංගු නොවන products සලකා බලන්න.',
        'සම වියළි නම් තද scrubs භාවිතයෙන් වළකින්න.',
      ],
    },
  },
  Combination: {
    en: {
      name: 'Combination Skin',
      description: 'A balanced routine for oily and dry areas.',
      morning: [
        'Gentle cleanser',
        'Lightweight moisturizer',
        'Broad-spectrum sunscreen SPF 30–50',
      ],
      night: [
        'Gentle cleanser',
        'Moisturizer, applying extra to dry areas if needed',
      ],
      tips: [
        'Your T-zone may be oily while your cheeks are dry.',
        'Choose products that feel comfortable on all areas.',
        'Adjust moisturizer to the needs of different areas.',
      ],
    },
    si: {
      name: 'මිශ්‍ර සම',
      description: 'තෙල් සහිත සහ වියළි ප්‍රදේශ දෙකටම ගැළපෙන routine එකක්.',
      morning: [
        'මෘදු cleanser එකක්',
        'සැහැල්ලු moisturizer එකක්',
        'SPF 30–50 sunscreen එකක්',
      ],
      night: [
        'මෘදු cleanser එකක්',
        'අවශ්‍ය නම් වියළි ප්‍රදේශවලට වැඩිපුර moisturizer',
      ],
      tips: [
        'නළල සහ නාසය තෙල් සහිත වුණත් කම්මුල් වියළි විය හැකියි.',
        'සමට පහසු products තෝරන්න.',
        'ප්‍රදේශ අනුව moisturizer ප්‍රමාණය වෙනස් කරන්න.',
      ],
    },
  },
  Normal: {
    en: {
      name: 'Normal Skin',
      description: 'A simple routine to maintain your skin balance.',
      morning: [
        'Gentle cleanser',
        'Moisturizer',
        'Broad-spectrum sunscreen SPF 30–50',
      ],
      night: [
        'Gentle cleanser',
        'Moisturizer',
      ],
      tips: [
        'Keep your routine simple and consistent.',
        'Introduce new products gradually.',
        'Use sunscreen every day.',
      ],
    },
    si: {
      name: 'සාමාන්‍ය සම',
      description: 'සමේ සමබරතාවය පවත්වාගැනීමට සරල routine එකක්.',
      morning: [
        'මෘදු cleanser එකක්',
        'Moisturizer එකක්',
        'SPF 30–50 sunscreen එකක්',
      ],
      night: [
        'මෘදු cleanser එකක්',
        'Moisturizer එකක්',
      ],
      tips: [
        'සරල routine එකක් පවත්වාගන්න.',
        'අලුත් products ක්‍රමයෙන් හඳුන්වා දෙන්න.',
        'දිනපතා sunscreen භාවිතා කරන්න.',
      ],
    },
  },
};

const concerns = {
  acne: {
    en: ['Acne and pimples', 'Consider suitable acne ingredients gradually. Avoid starting several active ingredients at once.'],
    si: ['කුරුලෑ', 'සමට ගැළපෙන acne ingredients ක්‍රමයෙන් හඳුන්වා දෙන්න. Active ingredients කිහිපයක් එකවර පටන් ගන්න එපා.'],
  },
  marks: {
    en: ['Dark spots and acne marks', 'Daily sunscreen is important. Azelaic acid may help some people with dark marks.'],
    si: ['කළු පැල්ලම් සහ acne marks', 'දිනපතා sunscreen භාවිතය වැදගත්. Azelaic acid සමහර අයට කළු පැල්ලම් සඳහා උපකාරී විය හැකියි.'],
  },
  dryness: {
    en: ['Dryness', 'Use moisturizer regularly and avoid harsh cleansers.'],
    si: ['සමේ වියළි බව', 'නිතර moisturizer භාවිතා කර තද cleansers වලින් වළකින්න.'],
  },
  sensitivity: {
    en: ['Sensitive skin', 'Choose gentle, fragrance-free products and patch-test new products.'],
    si: ['සංවේදී සම', 'මෘදු, සුවඳ ද්‍රව්‍ය රහිත products තෝරා අලුත් products මුලින් කුඩා ප්‍රදේශයක පරීක්ෂා කරන්න.'],
  },
  dullness: {
    en: ['Dull-looking skin', 'Start with gentle cleansing, moisturizer and daily sunscreen.'],
    si: ['දීප්තිය අඩු සම', 'මෘදු cleansing, moisturizer සහ දිනපතා sunscreen භාවිතයෙන් පටන් ගන්න.'],
  },
};

export default function RoutineFinder() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedType = localStorage.getItem('lumiereSkinType') || 'Normal';
  const initialType = location.state?.skinType || savedType;
  const initialLanguage = location.state?.language || 'en';

  const [skinType, setSkinType] = useState(
    routines[initialType] ? initialType : 'Normal'
  );
  const [language, setLanguage] = useState(initialLanguage);
  const [selectedConcerns, setSelectedConcerns] = useState([]);

  const text = {
    en: {
      language: 'Language',
      title: 'Your Skincare Routine',
      subtitle: 'Choose your skin type and concerns for a personalized guide.',
      skinType: 'Your skin type',
      concerns: 'Your skin concerns',
      morning: 'Morning Routine',
      night: 'Night Routine',
      tips: 'Skincare Tips',
      explore: 'Explore Products',
      quiz: 'Take Skin Type Quiz',
      note: 'This is general skincare guidance, not a medical diagnosis. Consult a dermatologist for persistent or severe skin concerns.',
    },
    si: {
      language: 'භාෂාව',
      title: 'ඔබේ Skincare Routine එක',
      subtitle: 'ඔබේ සමේ වර්ගය සහ ගැටලු තෝරාගන්න.',
      skinType: 'ඔබේ සමේ වර්ගය',
      concerns: 'ඔබේ සමේ ගැටලු',
      morning: 'උදෑසන Routine එක',
      night: 'රාත්‍රී Routine එක',
      tips: 'Skincare උපදෙස්',
      explore: 'Products බලන්න',
      quiz: 'Skin Type Quiz එක කරන්න',
      note: 'මෙය සාමාන්‍ය skincare උපදෙස් පමණයි. දිගටම පවතින හෝ දැඩි සමේ ගැටලු සඳහා චර්ම රෝග වෛද්‍යවරයෙකු හමුවන්න.',
    },
  }[language];

  const routine = routines[skinType][language];

  function toggleConcern(key) {
    setSelectedConcerns((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f5] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-end gap-3">
          <label htmlFor="routine-language" className="text-sm text-gray-700">
            {text.language}
          </label>
          <select
            id="routine-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg border border-[#eadbd0] bg-white p-2"
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
          </select>
        </div>

        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[#b48b6a]">
            Lumière Skincare
          </p>
          <h1 className="mb-3 text-3xl font-bold text-[#1e2b2b] md:text-4xl">
            {text.title} ✨
          </h1>
          <p className="text-gray-600">{text.subtitle}</p>
        </header>

        <section className="mb-6 rounded-3xl border border-[#eadbd0] bg-white p-6 shadow-sm">
          <label htmlFor="skin-type" className="mb-3 block font-semibold text-[#1e2b2b]">
            {text.skinType}
          </label>
          <select
            id="skin-type"
            value={skinType}
            onChange={(event) => {
              setSkinType(event.target.value);
              localStorage.setItem('lumiereSkinType', event.target.value);
            }}
            className="w-full rounded-xl border border-[#e4d4c8] bg-[#fcf8f5] p-3"
          >
            <option value="Oily">{language === 'en' ? 'Oily Skin' : 'තෙල් සහිත සම'}</option>
            <option value="Dry">{language === 'en' ? 'Dry Skin' : 'වියළි සම'}</option>
            <option value="Combination">{language === 'en' ? 'Combination Skin' : 'මිශ්‍ර සම'}</option>
            <option value="Normal">{language === 'en' ? 'Normal Skin' : 'සාමාන්‍ය සම'}</option>
          </select>

          <button
            onClick={() => navigate('/skin-quiz')}
            className="mt-3 text-sm font-semibold text-[#987052] underline"
          >
            {text.quiz}
          </button>
        </section>

        <section className="mb-6 rounded-3xl border border-[#eadbd0] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#1e2b2b]">
            {text.concerns}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(concerns).map(([key, value]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                  selectedConcerns.includes(key)
                    ? 'border-[#b48b6a] bg-[#fbf0e9]'
                    : 'border-[#eee3dc]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedConcerns.includes(key)}
                  onChange={() => toggleConcern(key)}
                  className="accent-[#b48b6a]"
                />
                <span className="text-sm text-gray-700">{value[language][0]}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#eadbd0] bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-[#1e2b2b]">
            {routine.name}
          </h2>
          <p className="mb-6 text-gray-600">{routine.description}</p>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              [text.morning, routine.morning, '☀️'],
              [text.night, routine.night, '🌙'],
            ].map(([heading, steps, emoji]) => (
              <div key={heading} className="rounded-2xl bg-[#fcf8f5] p-5">
                <h3 className="mb-4 text-lg font-bold text-[#1e2b2b]">
                  {emoji} {heading}
                </h3>
                <ol className="space-y-3">
                  {steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm text-gray-700">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ead8ca] font-semibold text-[#704d35]">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[#eadbd0] p-5">
            <h3 className="mb-3 text-lg font-bold text-[#1e2b2b]">
              💗 {text.tips}
            </h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
              {routine.tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </div>

          {selectedConcerns.length > 0 && (
            <div className="mt-5 rounded-2xl bg-[#fbf0e9] p-5">
              <h3 className="mb-3 text-lg font-bold text-[#1e2b2b]">
                ✨ {text.concerns}
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-gray-700">
                {selectedConcerns.map((key) => (
                  <li key={key}>
                    <strong>{concerns[key][language][0]}: </strong>
                    {concerns[key][language][1]}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate('/shop')}
            className="mt-6 w-full rounded-xl bg-[#b48b6a] px-6 py-3 font-semibold text-white transition hover:bg-[#987052]"
          >
            {text.explore} →
          </button>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-gray-500">
          {text.note}
        </p>
      </div>
    </div>
  );
}
