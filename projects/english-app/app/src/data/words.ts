import { WordData } from "@/types";
import { getPhonemeParams } from "./visemeParams";

function buildVisemes(phonemes: string[], durationEach = 0.35): WordData["visemeSequence"] {
  const seq: WordData["visemeSequence"] = [];
  seq.push({ time: 0, phoneme: "_", params: getPhonemeParams("_") });
  phonemes.forEach((p, i) => {
    seq.push({ time: 0.1 + i * durationEach, phoneme: p, params: getPhonemeParams(p) });
  });
  seq.push({ time: 0.1 + phonemes.length * durationEach + 0.1, phoneme: "_", params: getPhonemeParams("_") });
  return seq;
}

export const sampleWords: WordData[] = [
  {
    id: "1", word: "think", ipa: "/θɪŋk/", phonemes: ["θ", "ɪ", "ŋ", "k"],
    definitionZh: "想；认为", exampleSentence: "I **think** this is correct.", highlightWord: "think",
    confusionPair: { word: "sink", ipa: "/sɪŋk/", explanation: "/θ/ vs /s/ — 舌尖放在上下齿之间" },
    difficulty: 3, visemeSequence: buildVisemes(["θ", "ɪ", "ŋ", "k"]),
  },
  {
    id: "2", word: "sheep", ipa: "/ʃiːp/", phonemes: ["ʃ", "iː", "p"],
    definitionZh: "绵羊", exampleSentence: "The **sheep** are in the field.", highlightWord: "sheep",
    confusionPair: { word: "ship", ipa: "/ʃɪp/", explanation: "/iː/ vs /ɪ/ — 长元音 vs 短元音" },
    difficulty: 2, visemeSequence: buildVisemes(["ʃ", "iː", "p"]),
  },
  {
    id: "3", word: "father", ipa: "/ˈfɑːðər/", phonemes: ["f", "ɑː", "ð", "ə", "r"],
    definitionZh: "父亲", exampleSentence: "My **father** is a teacher.", highlightWord: "father",
    difficulty: 3, visemeSequence: buildVisemes(["f", "ɑː", "ð", "ə", "r"]),
  },
  {
    id: "4", word: "cat", ipa: "/kæt/", phonemes: ["k", "æ", "t"],
    definitionZh: "猫", exampleSentence: "The **cat** sat on the mat.", highlightWord: "cat",
    confusionPair: { word: "cut", ipa: "/kʌt/", explanation: "/æ/ vs /ʌ/ — 嘴张大 vs 半开" },
    difficulty: 1, visemeSequence: buildVisemes(["k", "æ", "t"]),
  },
  {
    id: "5", word: "food", ipa: "/fuːd/", phonemes: ["f", "uː", "d"],
    definitionZh: "食物", exampleSentence: "This **food** is delicious.", highlightWord: "food",
    confusionPair: { word: "foot", ipa: "/fʊt/", explanation: "/uː/ vs /ʊ/ — 长元音 vs 短元音" },
    difficulty: 2, visemeSequence: buildVisemes(["f", "uː", "d"]),
  },
  {
    id: "6", word: "about", ipa: "/əˈbaʊt/", phonemes: ["ə", "b", "aʊ", "t"],
    definitionZh: "关于", exampleSentence: "Tell me **about** your day.", highlightWord: "about",
    difficulty: 2, visemeSequence: buildVisemes(["ə", "b", "aʊ", "t"]),
  },
  {
    id: "7", word: "right", ipa: "/raɪt/", phonemes: ["r", "aɪ", "t"],
    definitionZh: "正确的；右边", exampleSentence: "You are **right** about that.", highlightWord: "right",
    confusionPair: { word: "light", ipa: "/laɪt/", explanation: "/r/ vs /l/ — 舌尖卷曲 vs 弹舌" },
    difficulty: 3, visemeSequence: buildVisemes(["r", "aɪ", "t"]),
  },
  {
    id: "8", word: "vine", ipa: "/vaɪn/", phonemes: ["v", "aɪ", "n"],
    definitionZh: "藤蔓", exampleSentence: "The **vine** grows on the wall.", highlightWord: "vine",
    confusionPair: { word: "wine", ipa: "/waɪn/", explanation: "/v/ vs /w/ — 唇齿摩擦 vs 双唇圆" },
    difficulty: 3, visemeSequence: buildVisemes(["v", "aɪ", "n"]),
  },
  {
    id: "9", word: "bed", ipa: "/bed/", phonemes: ["b", "e", "d"],
    definitionZh: "床", exampleSentence: "I'm going to **bed** early.", highlightWord: "bed",
    confusionPair: { word: "bad", ipa: "/bæd/", explanation: "/e/ vs /æ/ — 口腔开合度不同" },
    difficulty: 1, visemeSequence: buildVisemes(["b", "e", "d"]),
  },
  {
    id: "10", word: "world", ipa: "/wɜːrld/", phonemes: ["w", "ɜː", "r", "l", "d"],
    definitionZh: "世界", exampleSentence: "Hello **world**!", highlightWord: "world",
    difficulty: 4, visemeSequence: buildVisemes(["w", "ɜː", "r", "l", "d"]),
  },
];
