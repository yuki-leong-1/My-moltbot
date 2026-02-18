"use client";

import { WordData } from "@/types";

interface WordCardProps {
  word: WordData;
  isActive: boolean;
  onClick: () => void;
}

function renderSentence(sentence: string) {
  // Convert **word** to highlighted spans
  const parts = sentence.split(/\*\*(.*?)\*\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-primary font-bold underline decoration-primary/30 decoration-2 underline-offset-2">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function WordCard({ word, isActive, onClick }: WordCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 hover:shadow-lg ${
        isActive
          ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
          : "border-gray-200 bg-white hover:border-primary/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className="text-2xl font-bold text-gray-900">{word.word}</h2>
        <span className="text-lg text-primary font-mono">{word.ipa}</span>
        <div className="ml-auto flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < word.difficulty ? "bg-accent" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Phoneme chips */}
      <div className="flex gap-1 mb-3">
        {word.phonemes.map((p, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-sm font-mono text-gray-700">
            /{p}/
          </span>
        ))}
      </div>

      {/* Chinese definition */}
      <p className="text-gray-600 mb-2 text-base">📖 {word.definitionZh}</p>

      {/* Example sentence */}
      <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
        💬 {renderSentence(word.exampleSentence)}
      </p>

      {/* Confusion pair */}
      {word.confusionPair && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
          <span className="font-semibold text-amber-700">⚡ 易混淆：</span>
          <span className="text-gray-700 ml-1">
            {word.word} <span className="text-primary">{word.ipa}</span>
            {" vs "}
            {word.confusionPair.word} <span className="text-primary">{word.confusionPair.ipa}</span>
          </span>
          <p className="text-gray-500 mt-1">{word.confusionPair.explanation}</p>
        </div>
      )}
    </div>
  );
}
