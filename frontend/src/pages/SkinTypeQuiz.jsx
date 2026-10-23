
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const translations = {
  en: {
    title: 'Find Your Skin Type',
    subtitle: 'Answer these questions to discover your skin type.',
    language: 'Language',
    questions: [
      {
        question: 'How does your skin feel one hour after washing?',
        options: [
          ['Oily all over', 'Oily'],
          ['Tight or dry', 'Dry'],
          ['Oily T-zone, normal cheeks', 'Combination'],
          ['Comfortable and balanced', 'Normal'],
        ],
      },
      {
        question: 'How does your skin feel during the day?',
        options: [
          ['Shiny and oily', 'Oily'],
          ['Dry or flaky', 'Dry'],
          ['Oily in some areas only', 'Combination'],
          ['Mostly comfortable', 'Normal'],
        ],
      },
      {
        question: 'How visible are your pores?',
        options: [
          ['Large and visible', 'Oily'],
          ['Small, with dry skin', 'Dry'],
          ['Visible mainly around my nose', 'Combination'],
          ['Not very noticeable', 'Normal'],
        ],
      },
      {
        question: 'Which description fits your skin best?',
        options: [
          ['Frequent oiliness and pimples', 'Oily'],
          ['Roughness or flaking', 'Dry'],
          ['Oily and dry areas', 'Combination'],
          ['Generally balanced skin', 'Normal'],
        ],
      },
    ],
    result: 'Your Skin Type',
    descriptions: {
      Oily: 'Your answers suggest that you may have oily skin.',
      Dry: 'Your answers suggest that you may have dry skin.',
      Combination: 'Your answers suggest that you may have combination skin.',
      Normal: 'Your answers suggest that you may have normal skin.',
    },
    names: {
      Oily: 'Oily Skin',
      Dry: 'Dry Skin',
      Combination: 'Combination Skin',
      Normal: 'Normal Skin',
    },
    submit: 'Discover My Skin Type',
    routine: 'Find My Routine',
    retry: 'Retake Quiz',
    required: 'Please answer all questions.',
    note: 'This quiz is an estimate, not a medical diagnosis.',
  },
  si: {
    title: 'ඔබේ සමේ වර්ගය හඳුනාගන්න',
    subtitle: 'ඔබේ සමේ වර්ගය දැනගැනීමට ප්‍රශ්නවලට පිළිතුරු දෙන්න.',
    language: 'භාෂාව',
    questions: [
      {
        question: 'මුහුණ සෝදා පැයකට පසු සම දැනෙන්නේ කෙසේද?',
        options: [
          ['මුහුණ පුරා තෙල් ගතියක් ඇත', 'Oily'],
          ['වියළි හෝ ඇදෙන ගතියක් ඇත', 'Dry'],
          ['නළල හා නාසය තෙල් සහිතයි', 'Combination'],
          ['සම සාමාන්‍ය සහ සුවපහසුයි', 'Normal'],
        ],
      },
      {
        question: 'දවසේ මැදදී ඔබේ සම දැනෙන්නේ කෙසේද?',
        options: [
          ['තෙල් සහිත හා දිලිසෙනවා', 'Oily'],
          ['වියළි හෝ පොතු ගැලවෙනවා', 'Dry'],
          ['සමහර ප්‍රදේශ පමණක් තෙල් සහිතයි', 'Combination'],
          ['සාමාන්‍ය තත්ත්වයක පවතිනවා', 'Normal'],
        ],
      },
      {
        question: 'ඔබේ සමේ pores කොතරම් පැහැදිලිව පෙනෙනවාද?',
        options: [
          ['විශාලව පෙනෙනවා', 'Oily'],
          ['කුඩාවට පෙනෙන අතර සම වියළියි', 'Dry'],
          ['නාසය අවට වැඩියෙන් පෙනෙනවා', 'Combination'],
          ['එතරම් පැහැදිලිව පෙනෙන්නේ නැහැ', 'Normal'],
        ],
      },
      {
        question: 'ඔබේ සමට වඩාත් ගැළපෙන විස්තරය කුමක්ද?',
        options: [
          ['තෙල් ගතිය සහ කුරුලෑ නිතර ඇතිවීම', 'Oily'],
          ['රළු බව හෝ පොතු ගැලවීම', 'Dry'],
          ['තෙල් සහිත හා වියළි ප්‍රදේශ දෙකම තිබීම', 'Combination'],
          ['සාමාන්‍ය සමබර සමක් තිබීම', 'Normal'],
        ],
      },
    ],
    result: 'ඔබේ සමේ වර්ගය',
    descriptions: {
      Oily: 'ඔබේ පිළිතුරු අනුව තෙල් සහිත සමක් තිබිය හැකියි.',
      Dry: 'ඔබේ පිළිතුරු අනුව වියළි සමක් තිබිය හැකියි.',
      Combination: 'ඔබේ පිළිතුරු අනුව මිශ්‍ර සමක් තිබිය හැකියි.',
      Normal: 'ඔබේ පිළිතුරු අනුව සාමාන්‍ය සමක් තිබිය හැකියි.',
    },
    names: {
      Oily: 'තෙල් සහිත සම',
      Dry: 'වියළි සම',
      Combination: 'මිශ්‍ර සම',
      Normal: 'සාමාන්‍ය සම',
    },
    submit: 'මගේ සමේ වර්ගය හඳුනාගන්න',
    routine: 'මගේ Routine එක බලන්න',
    retry: 'නැවත උත්සාහ කරන්න',
    required: 'කරුණාකර සියලුම ප්‍රශ්නවලට පිළිතුරු දෙන්න.',
    note: 'මෙය මූලික ඇස්තමේන්තුවක් පමණයි. වෛද්‍යමය නිර්ණයක් නොවේ.',
  },
};

export default function SkinTypeQuiz() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');

  const t = translations[language];

  function handleSubmit(event) {
    event.preventDefault();

    if (Object.keys(answers).length !== t.questions.length) {
      window.alert(t.required);
      return;
    }

    const scores = {
      Oily: 0,
      Dry: 0,
      Combination: 0,
      Normal: 0,
    };

    Object.values(answers).forEach((type) => {
      scores[type] += 1;
    });

    const maxScore = Math.max(...Object.values(scores));
    const winners = Object.keys(scores).filter(
      (type) => scores[type] === maxScore
    );

    const skinType = winners.includes('Combination')
      ? 'Combination'
      : winners[0];

    setResult(skinType);
    localStorage.setItem('lumiereSkinType', skinType);
  }

  return (
    <div className="min-h-screen bg-[#fcf8f5] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-end gap-3">
          <label htmlFor="quiz-language" className="text-sm text-gray-700">
            {t.language}
          </label>
          <select
            id="quiz-language"
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
            {t.title} ✨
          </h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </header>

        {!result ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-[#eadbd0] bg-white p-5 shadow-sm md:p-8"
          >
            {t.questions.map((item, index) => (
              <section
                key={item.question}
                className="border-b border-[#f0e6df] pb-6 last:border-0"
              >
                <h2 className="mb-4 text-lg font-semibold text-[#1e2b2b]">
                  {index + 1}. {item.question}
                </h2>

                <div className="space-y-3">
                  {item.options.map(([label, type]) => (
                    <label
                      key={label}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        answers[index] === type
                          ? 'border-[#b48b6a] bg-[#fbf0e9]'
                          : 'border-[#eee3dc] hover:bg-[#fcf8f5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={answers[index] === type}
                        onChange={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [index]: type,
                          }))
                        }
                        className="accent-[#b48b6a]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </section>
            ))}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#b48b6a] px-6 py-3 font-semibold text-white transition hover:bg-[#987052]"
            >
              {t.submit} →
            </button>
          </form>
        ) : (
          <div className="rounded-3xl border border-[#eadbd0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">🌸</div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b48b6a]">
              {t.result}
            </h2>
            <h3 className="mb-4 text-2xl font-bold text-[#1e2b2b]">
              {t.names[result]}
            </h3>
            <p className="mb-3 text-gray-600">{t.descriptions[result]}</p>
            <p className="mb-7 text-sm text-gray-500">{t.note}</p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() =>
                  navigate('/routine-finder', {
                    state: { skinType: result, language },
                  })
                }
                className="rounded-xl bg-[#b48b6a] px-6 py-3 font-semibold text-white hover:bg-[#987052]"
              >
                {t.routine} →
              </button>
              <button
                onClick={() => {
                  setAnswers({});
                  setResult('');
                }}
                className="rounded-xl border border-[#b48b6a] px-6 py-3 font-semibold text-[#987052]"
              >
                {t.retry}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
