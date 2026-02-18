export interface MouthParams {
  lipRound: number;    // 0-1
  lipOpen: number;     // 0-1
  jawAngle: number;    // 0-1
  tongueTipX: number;  // 0-1 (back to front)
  tongueTipY: number;  // 0-1 (low to high)
  tongueBodyX: number; // 0-1
  tongueBodyY: number; // 0-1
  tongueShape: "flat" | "curved" | "retroflex";
}

export interface VisemeKeyframe {
  time: number; // seconds
  phoneme: string;
  params: MouthParams;
}

export interface WordData {
  id: string;
  word: string;
  ipa: string;
  phonemes: string[];
  definitionZh: string;
  exampleSentence: string;
  highlightWord: string;
  confusionPair?: { word: string; ipa: string; explanation: string };
  difficulty: number;
  visemeSequence: VisemeKeyframe[];
}
