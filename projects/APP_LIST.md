# 📱 App & Project List

记录所有规划/开发中的 App 和项目。

---

## 1. SpeakRight — 美式英语发音学习 App

- **状态**: 📋 规划阶段
- **创建日期**: 2026-02-16
- **设计文档**: `projects/english-app/DESIGN.md`

### 简介
专为中文母语者设计的美式英语发音学习 App，核心卖点是"看得见的发音"。

### 核心功能
- 🗣️ **3D 口腔动画** — 正面+剖面双视角，展示舌头、嘴唇、下巴位置
- 📇 **智能单词卡** — IPA 音标 + 口型动画 + 例句 + 易混淆对比，SM-2 间隔重复
- 🎤 **AI 发音评估** — 音素级评分，标注哪个音发错了，针对性纠错建议
- 📚 **双线课程** — 按音素进阶 + 按场景分类（日常/商务/旅游/面试）
- 🎯 **中文母语者专项** — th, r/l, v/w, 元音长短等难点专项训练

### 技术栈
- 前端: React Native + Three.js (3D渲染)
- 后端: Node.js (Fastify) + Python (FastAPI for ML)
- AI: Whisper ASR + Montreal Forced Aligner + SpeechBrain
- DB: PostgreSQL + Redis
- 3D: Three.js + Viseme blendshape 自研口腔模型

### 商业模式
- 免费层: 基础音素课 + 每日5词
- Pro: ¥68/月 或 ¥498/年

### 路线图
| 阶段 | 时间 | 目标 |
|------|------|------|
| Phase 0 | 1个月 | 技术验证 |
| MVP | 2个月 | 核心体验闭环，内测 |
| V1 | 3个月 | 完整产品，公测 |
| V2 | 4个月 | 差异化壁垒，AI对话 |

---

_更多项目待添加..._
