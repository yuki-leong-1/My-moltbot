"use client";

import { useState } from "react";
import WordCard from "@/components/wordcard/WordCard";
import MouthPlayer from "@/components/mouth/MouthPlayer";
import { sampleWords } from "@/data/words";

export default function Home() {
  const [activeWordId, setActiveWordId] = useState(sampleWords[0].id);
  const activeWord = sampleWords.find((w) => w.id === activeWordId) || sampleWords[0];

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          🗣️ SpeakRight <span className="text-primary">看得见的发音</span>
        </h1>
        <p className="text-gray-500 mt-1">点击单词卡 → 查看口腔剖面动画</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 3D Mouth Visualization */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold">{activeWord.word}</span>
              <span className="text-primary font-mono">{activeWord.ipa}</span>
              <span className="ml-auto px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                剖面视图
              </span>
            </div>
            <MouthPlayer
              visemeSequence={activeWord.visemeSequence}
              phonemes={activeWord.phonemes}
            />
          </div>
        </div>

        {/* Right: Word Cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📚 单词卡 ({sampleWords.length} words)
          </h2>
          {sampleWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isActive={word.id === activeWordId}
              onClick={() => setActiveWordId(word.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
