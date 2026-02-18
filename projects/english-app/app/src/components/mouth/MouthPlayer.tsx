"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import MouthCrossSection, { lerpParams } from "./MouthCrossSection";
import PronunciationGuide from "./PronunciationGuide";
import { VisemeKeyframe, MouthParams } from "@/types";

interface MouthPlayerProps {
  visemeSequence: VisemeKeyframe[];
  phonemes: string[];
}

export default function MouthPlayer({ visemeSequence, phonemes }: MouthPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPhonemeIdx, setCurrentPhonemeIdx] = useState(-1);
  const [currentParams, setCurrentParams] = useState<MouthParams>(
    visemeSequence[0]?.params || {
      lipRound: 0.2, lipOpen: 0.05, jawAngle: 0.02,
      tongueTipX: 0.5, tongueTipY: 0.3, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat",
    }
  );
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const totalDuration = visemeSequence.length > 0
    ? visemeSequence[visemeSequence.length - 1].time
    : 1;

  const getParamsAtTime = useCallback((t: number): { params: MouthParams; phonemeIdx: number } => {
    if (visemeSequence.length === 0) return { params: currentParams, phonemeIdx: -1 };
    if (t <= visemeSequence[0].time) return { params: visemeSequence[0].params, phonemeIdx: -1 };
    if (t >= visemeSequence[visemeSequence.length - 1].time) {
      return { params: visemeSequence[visemeSequence.length - 1].params, phonemeIdx: visemeSequence.length - 2 };
    }

    let i = 0;
    while (i < visemeSequence.length - 1 && visemeSequence[i + 1].time < t) i++;
    const from = visemeSequence[i];
    const to = visemeSequence[i + 1];
    const localT = (t - from.time) / (to.time - from.time);
    const smoothT = localT * localT * (3 - 2 * localT);
    return { params: lerpParams(from.params, to.params, smoothT), phonemeIdx: i };
  }, [visemeSequence, currentParams]);

  const animate = useCallback((timestamp: number) => {
    const elapsed = ((timestamp - startTimeRef.current) / 1000) * speed;
    const t = pausedAtRef.current + elapsed;

    if (t >= totalDuration) {
      setIsPlaying(false);
      setCurrentTime(totalDuration);
      const { params, phonemeIdx } = getParamsAtTime(totalDuration);
      setCurrentParams(params);
      setCurrentPhonemeIdx(phonemeIdx);
      pausedAtRef.current = 0;
      return;
    }

    setCurrentTime(t);
    const { params, phonemeIdx } = getParamsAtTime(t);
    setCurrentParams(params);
    setCurrentPhonemeIdx(phonemeIdx);
    animRef.current = requestAnimationFrame(animate);
  }, [speed, totalDuration, getParamsAtTime]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      animRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, animate]);

  const play = () => {
    if (currentTime >= totalDuration) {
      pausedAtRef.current = 0;
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
    pausedAtRef.current = currentTime;
  };

  const reset = () => {
    setIsPlaying(false);
    pausedAtRef.current = 0;
    setCurrentTime(0);
    setCurrentParams(visemeSequence[0]?.params || currentParams);
    setCurrentPhonemeIdx(-1);
  };

  const jumpToPhoneme = (idx: number) => {
    if (idx < 0 || idx >= visemeSequence.length) return;
    setIsPlaying(false);
    const t = visemeSequence[idx].time;
    pausedAtRef.current = t;
    setCurrentTime(t);
    setCurrentParams(visemeSequence[idx].params);
    setCurrentPhonemeIdx(idx);
  };

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visemeSequence]);

  return (
    <div className="flex flex-col gap-3">
      {/* SVG Mouth View */}
      <MouthCrossSection currentParams={currentParams} showLabels={true} />

      {/* Phoneme timeline */}
      <div className="flex items-center gap-1 px-2 flex-wrap">
        {visemeSequence.map((kf, i) => (
          <button
            key={i}
            onClick={() => jumpToPhoneme(i)}
            className={`px-2 py-1 rounded text-sm font-mono transition-all ${
              i === currentPhonemeIdx
                ? "bg-primary text-white scale-110"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {kf.phoneme === "_" ? "·" : `/${kf.phoneme}/`}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-2">
        <button
          onClick={isPlaying ? pause : play}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
        >
          {isPlaying ? "⏸ 暂停" : "▶ 播放"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          ⏮ 重置
        </button>
        <select
          value={speed}
          onChange={(e) => {
            const newSpeed = parseFloat(e.target.value);
            if (isPlaying) {
              pausedAtRef.current = currentTime;
              startTimeRef.current = performance.now();
            }
            setSpeed(newSpeed);
          }}
          className="px-2 py-2 border rounded-lg bg-white text-sm"
        >
          <option value={0.25}>0.25x 超慢</option>
          <option value={0.5}>0.5x 慢速</option>
          <option value={1}>1x 正常</option>
        </select>

        {/* Progress bar */}
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      {/* Pronunciation Guide */}
      <PronunciationGuide phonemes={phonemes} currentPhonemeIdx={currentPhonemeIdx} />
    </div>
  );
}
