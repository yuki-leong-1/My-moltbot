"use client";

import { phonemeGuides } from "@/data/phonemeGuide";

interface PronunciationGuideProps {
  phonemes: string[];
  currentPhonemeIdx: number;
}

export default function PronunciationGuide({ phonemes, currentPhonemeIdx }: PronunciationGuideProps) {
  // Find the active phoneme (from viseme sequence, skip "_" rest)
  // currentPhonemeIdx maps to visemeSequence index, but phonemes array is the actual phoneme list
  // We need to figure out which phoneme is active
  // visemeSequence: [_, phoneme0, phoneme1, ..., _]
  // so currentPhonemeIdx 0 = _, 1 = phoneme[0], etc.
  const activePhonemeArrayIdx = currentPhonemeIdx - 1; // offset by the initial rest

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">📖 发音指南</h3>
      <div className="space-y-2">
        {phonemes.map((ph, i) => {
          const guide = phonemeGuides[ph];
          const isActive = i === activePhonemeArrayIdx;

          if (!guide) {
            return (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
                  isActive ? "bg-primary/10 border border-primary/30" : "bg-gray-50"
                }`}
              >
                <span className="font-mono font-bold text-primary">/{ph}/</span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`rounded-lg px-3 py-2.5 transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 border-2 border-primary/40 shadow-sm"
                  : "bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`font-mono font-bold text-lg ${isActive ? "text-primary" : "text-gray-700"}`}>
                  /{ph}/
                </span>
                <span className="text-xs text-gray-400">{guide.example}</span>
                {isActive && (
                  <span className="ml-auto text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                    当前
                  </span>
                )}
              </div>

              <div className={`space-y-1 text-sm transition-all duration-300 ${
                isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}>
                <div className="flex gap-2">
                  <span className="text-pink-600 font-medium whitespace-nowrap">👄 嘴唇：</span>
                  <span className="text-gray-700">{guide.lips}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-600 font-medium whitespace-nowrap">👅 舌头：</span>
                  <span className="text-gray-700">{guide.tongue}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-600 font-medium whitespace-nowrap">💨 气流：</span>
                  <span className="text-gray-700">{guide.airflow}</span>
                </div>
                {guide.commonMistake && (
                  <div className="flex gap-2 mt-1 bg-red-50 rounded px-2 py-1">
                    <span className="text-red-500 font-medium whitespace-nowrap">❌ 常见错误：</span>
                    <span className="text-red-700">{guide.commonMistake}</span>
                  </div>
                )}
              </div>

              {/* Collapsed summary when not active */}
              {!isActive && (
                <p className="text-xs text-gray-400 truncate">
                  {guide.lips} · {guide.tongue}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
