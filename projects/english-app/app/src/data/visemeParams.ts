import { MouthParams } from "@/types";

// Mouth parameter presets for key phonemes
export const phonemeParams: Record<string, MouthParams> = {
  // Vowels
  "iː": { lipRound: 0.1, lipOpen: 0.25, jawAngle: 0.15, tongueTipX: 0.7, tongueTipY: 0.3, tongueBodyX: 0.8, tongueBodyY: 0.85, tongueShape: "curved" },
  "ɪ":  { lipRound: 0.15, lipOpen: 0.3, jawAngle: 0.2, tongueTipX: 0.65, tongueTipY: 0.25, tongueBodyX: 0.75, tongueBodyY: 0.75, tongueShape: "curved" },
  "æ":  { lipRound: 0.05, lipOpen: 0.75, jawAngle: 0.7, tongueTipX: 0.7, tongueTipY: 0.15, tongueBodyX: 0.6, tongueBodyY: 0.3, tongueShape: "flat" },
  "ɑː": { lipRound: 0.2, lipOpen: 0.9, jawAngle: 0.85, tongueTipX: 0.5, tongueTipY: 0.1, tongueBodyX: 0.35, tongueBodyY: 0.2, tongueShape: "flat" },
  "ɒ":  { lipRound: 0.4, lipOpen: 0.7, jawAngle: 0.65, tongueTipX: 0.45, tongueTipY: 0.1, tongueBodyX: 0.3, tongueBodyY: 0.25, tongueShape: "flat" },
  "uː": { lipRound: 0.9, lipOpen: 0.15, jawAngle: 0.1, tongueTipX: 0.4, tongueTipY: 0.2, tongueBodyX: 0.25, tongueBodyY: 0.8, tongueShape: "curved" },
  "ʊ":  { lipRound: 0.7, lipOpen: 0.25, jawAngle: 0.2, tongueTipX: 0.45, tongueTipY: 0.2, tongueBodyX: 0.3, tongueBodyY: 0.7, tongueShape: "curved" },
  "ə":  { lipRound: 0.3, lipOpen: 0.35, jawAngle: 0.3, tongueTipX: 0.55, tongueTipY: 0.2, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "ʌ":  { lipRound: 0.2, lipOpen: 0.5, jawAngle: 0.45, tongueTipX: 0.55, tongueTipY: 0.15, tongueBodyX: 0.45, tongueBodyY: 0.4, tongueShape: "flat" },
  "ɜː": { lipRound: 0.25, lipOpen: 0.4, jawAngle: 0.35, tongueTipX: 0.5, tongueTipY: 0.25, tongueBodyX: 0.5, tongueBodyY: 0.55, tongueShape: "curved" },
  "e":  { lipRound: 0.1, lipOpen: 0.4, jawAngle: 0.35, tongueTipX: 0.7, tongueTipY: 0.2, tongueBodyX: 0.7, tongueBodyY: 0.6, tongueShape: "flat" },
  // Diphthongs (use end position)
  "eɪ": { lipRound: 0.1, lipOpen: 0.3, jawAngle: 0.25, tongueTipX: 0.7, tongueTipY: 0.25, tongueBodyX: 0.75, tongueBodyY: 0.7, tongueShape: "flat" },
  "aɪ": { lipRound: 0.1, lipOpen: 0.3, jawAngle: 0.25, tongueTipX: 0.7, tongueTipY: 0.25, tongueBodyX: 0.75, tongueBodyY: 0.75, tongueShape: "curved" },
  "oʊ": { lipRound: 0.8, lipOpen: 0.2, jawAngle: 0.15, tongueTipX: 0.4, tongueTipY: 0.2, tongueBodyX: 0.3, tongueBodyY: 0.7, tongueShape: "curved" },
  "aʊ": { lipRound: 0.7, lipOpen: 0.25, jawAngle: 0.2, tongueTipX: 0.4, tongueTipY: 0.2, tongueBodyX: 0.3, tongueBodyY: 0.65, tongueShape: "curved" },
  // Consonants
  "θ":  { lipRound: 0.1, lipOpen: 0.15, jawAngle: 0.1, tongueTipX: 0.95, tongueTipY: 0.55, tongueBodyX: 0.5, tongueBodyY: 0.4, tongueShape: "flat" },
  "ð":  { lipRound: 0.1, lipOpen: 0.15, jawAngle: 0.1, tongueTipX: 0.95, tongueTipY: 0.55, tongueBodyX: 0.5, tongueBodyY: 0.4, tongueShape: "flat" },
  "s":  { lipRound: 0.1, lipOpen: 0.1, jawAngle: 0.05, tongueTipX: 0.85, tongueTipY: 0.7, tongueBodyX: 0.6, tongueBodyY: 0.5, tongueShape: "curved" },
  "z":  { lipRound: 0.1, lipOpen: 0.1, jawAngle: 0.05, tongueTipX: 0.85, tongueTipY: 0.7, tongueBodyX: 0.6, tongueBodyY: 0.5, tongueShape: "curved" },
  "ʃ":  { lipRound: 0.5, lipOpen: 0.15, jawAngle: 0.1, tongueTipX: 0.75, tongueTipY: 0.65, tongueBodyX: 0.55, tongueBodyY: 0.55, tongueShape: "curved" },
  "ŋ":  { lipRound: 0.2, lipOpen: 0.1, jawAngle: 0.1, tongueTipX: 0.4, tongueTipY: 0.15, tongueBodyX: 0.25, tongueBodyY: 0.85, tongueShape: "curved" },
  "k":  { lipRound: 0.2, lipOpen: 0.2, jawAngle: 0.15, tongueTipX: 0.4, tongueTipY: 0.15, tongueBodyX: 0.25, tongueBodyY: 0.9, tongueShape: "curved" },
  "t":  { lipRound: 0.1, lipOpen: 0.1, jawAngle: 0.05, tongueTipX: 0.85, tongueTipY: 0.85, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "d":  { lipRound: 0.1, lipOpen: 0.1, jawAngle: 0.05, tongueTipX: 0.85, tongueTipY: 0.85, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "n":  { lipRound: 0.1, lipOpen: 0.1, jawAngle: 0.05, tongueTipX: 0.85, tongueTipY: 0.85, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "l":  { lipRound: 0.1, lipOpen: 0.2, jawAngle: 0.15, tongueTipX: 0.85, tongueTipY: 0.8, tongueBodyX: 0.5, tongueBodyY: 0.4, tongueShape: "flat" },
  "r":  { lipRound: 0.3, lipOpen: 0.2, jawAngle: 0.15, tongueTipX: 0.7, tongueTipY: 0.6, tongueBodyX: 0.45, tongueBodyY: 0.5, tongueShape: "retroflex" },
  "p":  { lipRound: 0.8, lipOpen: 0.0, jawAngle: 0.0, tongueTipX: 0.5, tongueTipY: 0.3, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "b":  { lipRound: 0.8, lipOpen: 0.0, jawAngle: 0.0, tongueTipX: 0.5, tongueTipY: 0.3, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "m":  { lipRound: 0.8, lipOpen: 0.0, jawAngle: 0.0, tongueTipX: 0.5, tongueTipY: 0.3, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
  "f":  { lipRound: 0.1, lipOpen: 0.05, jawAngle: 0.05, tongueTipX: 0.5, tongueTipY: 0.2, tongueBodyX: 0.5, tongueBodyY: 0.4, tongueShape: "flat" },
  "v":  { lipRound: 0.1, lipOpen: 0.05, jawAngle: 0.05, tongueTipX: 0.5, tongueTipY: 0.2, tongueBodyX: 0.5, tongueBodyY: 0.4, tongueShape: "flat" },
  "w":  { lipRound: 0.9, lipOpen: 0.1, jawAngle: 0.05, tongueTipX: 0.4, tongueTipY: 0.2, tongueBodyX: 0.3, tongueBodyY: 0.75, tongueShape: "curved" },
  "h":  { lipRound: 0.2, lipOpen: 0.4, jawAngle: 0.3, tongueTipX: 0.5, tongueTipY: 0.2, tongueBodyX: 0.5, tongueBodyY: 0.4, tongueShape: "flat" },
  "dʒ": { lipRound: 0.5, lipOpen: 0.15, jawAngle: 0.1, tongueTipX: 0.75, tongueTipY: 0.7, tongueBodyX: 0.55, tongueBodyY: 0.6, tongueShape: "curved" },
  // Rest / neutral
  "_":  { lipRound: 0.2, lipOpen: 0.05, jawAngle: 0.02, tongueTipX: 0.5, tongueTipY: 0.3, tongueBodyX: 0.5, tongueBodyY: 0.5, tongueShape: "flat" },
};

export function getPhonemeParams(phoneme: string): MouthParams {
  return phonemeParams[phoneme] || phonemeParams["_"];
}
