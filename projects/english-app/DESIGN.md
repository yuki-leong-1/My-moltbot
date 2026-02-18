# SpeakRight — 美式英语发音学习 App 产品设计文档

> 版本：v0.1 | 日期：2026-02-16 | 状态：规划阶段

---

## 目录

1. [产品概述](#1-产品概述)
2. [竞品分析](#2-竞品分析)
3. [功能详细设计](#3-功能详细设计)
4. [3D Avatar 技术方案对比](#4-3d-avatar-技术方案对比)
5. [技术架构](#5-技术架构)
6. [数据库设计](#6-数据库设计)
7. [API 设计](#7-api-设计)
8. [技术栈推荐](#8-技术栈推荐)
9. [开源资源清单](#9-开源资源清单)
10. [开发路线图](#10-开发路线图)

---

## 1. 产品概述

### 1.1 目标用户

- **主要用户**：中文母语者（18-45岁），想提升美式英语发音
- **次要用户**：其他亚洲语系母语者、英语教师
- **场景**：自学、备考（托福/雅思口语）、职场英语

### 1.2 核心痛点

| 痛点 | 描述 |
|------|------|
| 看不到嘴型 | 传统 App 只有音频，用户不知道舌头/嘴唇该怎么放 |
| 不知道哪里错 | 录音后没有音素级反馈，只知道"不对"但不知道"哪里不对" |
| 中式发音盲区 | th/ð、r/l、v/w、元音长短等问题缺乏针对性训练 |
| 缺乏系统性 | 零散学单词，没有从音素→单词→句子→场景的进阶路径 |

### 1.3 核心价值主张

**"看得见的发音"** — 通过 3D 口腔动画让用户直观看到每个音素的发音方式，结合 AI 语音评估提供音素级纠错反馈，专为中文母语者设计的系统化美式英语发音训练。

### 1.4 商业模式

- **免费层**：基础音素课程、每日 5 个单词卡、有限录音评估
- **Pro 订阅**（¥68/月 或 ¥498/年）：全部课程、无限练习、详细报告、离线模式

---

## 2. 竞品分析

| 维度 | ELSA Speak | Speechling | Forvo | 我们 (SpeakRight) |
|------|-----------|------------|-------|-------------------|
| 3D 口型示范 | ❌ 无 | ❌ 无 | ❌ 无 | ✅ 3D 动画 + 口腔剖面图 |
| AI 发音评分 | ✅ 音素级（强） | ⚠️ 人工反馈 | ❌ 无 | ✅ 音素级 AI |
| 中文母语者适配 | ⚠️ 通用 | ⚠️ 通用 | ❌ 无 | ✅ 专项设计 |
| 间隔重复 | ⚠️ 有限 | ❌ 无 | ❌ 无 | ✅ SM-2 算法 |
| 课程体系 | ✅ 完善 | ⚠️ 按课程 | ❌ 词典式 | ✅ 音素+场景双线 |
| 价格 | $12/月 | $20/月 | 免费 | ¥68/月 |
| 最小发音单元 | 音素 | 句子 | 单词 | 音素 |

**差异化优势**：3D 可视化 + 中文母语者专项 + 音素级系统化课程，是市场空白。

---

## 3. 功能详细设计

### 3.1 3D Avatar 口型示范

#### 功能规格

- **口腔 3D 模型**：显示嘴唇、舌头、牙齿、上颚、下巴的位置和运动
- **双视角**：
  - 正面视角：看嘴唇形状（圆/扁/张开程度）
  - 剖面视角：看舌头在口腔中的位置（关键！）
- **播放控制**：
  - 正常速度 / 0.5x 慢速 / 0.25x 超慢速
  - 循环播放
  - 逐帧步进（每帧 ~33ms）
  - 可暂停在任意位置观察口型
- **标注层**：可叠加显示气流方向、声带振动提示
- **粒度**：
  - 单音素（如 /θ/）
  - 单词（音素序列动画）
  - 短句（含连读、弱读动画）

#### 交互设计

```
┌─────────────────────────┐
│   [正面]  [剖面]  [对比] │
│  ┌───────────────────┐  │
│  │                   │  │
│  │   3D 口腔模型     │  │
│  │                   │  │
│  └───────────────────┘  │
│  ◄ ▶ ⏸ 🔄  [0.5x ▼]   │
│                         │
│  /θ/ → /ɪ/ → /ŋ/ → /k/ │
│  ^^^(当前音素高亮)       │
│                         │
│  thing /θɪŋk/           │
│  "I **think** so."      │
└─────────────────────────┘
```

### 3.2 单词卡系统 (Flashcards)

#### 卡片内容

每张卡片包含：

| 字段 | 示例 |
|------|------|
| 单词 | think |
| IPA 音标 | /θɪŋk/ |
| 音素分解 | /θ/ + /ɪ/ + /ŋ/ + /k/ |
| 发音音频 | 美式 TTS 或真人录音 |
| 3D 口型动画 | 嵌入播放器 |
| 中文释义 | 想；认为 |
| 例句 | I **think** this is correct. |
| 易混淆词 | think vs sink（/θ/ vs /s/） |
| 难度标签 | 中级 |
| 母语干扰提示 | "中文没有 /θ/ 音，注意舌尖放在上下齿之间" |

#### 间隔重复算法 (SM-2 变体)

```python
def schedule_review(card, quality):  # quality: 0-5
    if quality < 3:  # 失败
        card.repetitions = 0
        card.interval = 1  # 明天再来
    else:
        if card.repetitions == 0:
            card.interval = 1
        elif card.repetitions == 1:
            card.interval = 3
        else:
            card.interval = round(card.interval * card.ease_factor)
        card.repetitions += 1

    # 更新 ease factor
    card.ease_factor = max(1.3,
        card.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    card.next_review = today + timedelta(days=card.interval)
```

#### 学习模式

1. **浏览模式**：翻卡学习，先看→听→看口型→翻面
2. **测试模式**：听音选词 / 看词说音 / 听音选音标
3. **对比模式**：并排展示易混淆词对（如 ship/sheep），交替播放

### 3.3 发音练习

#### 评估流程

```
用户录音 → 预处理(降噪/VAD) → 语音识别(ASR) → 强制对齐(Forced Alignment)
                                                         ↓
                                           音素级时间戳 + 置信度
                                                         ↓
                                              与参考发音对比评分
                                                         ↓
                                           生成反馈（哪些音素有问题）
```

#### 评分维度

| 维度 | 权重 | 说明 |
|------|------|------|
| 音素准确度 | 40% | 每个音素是否正确 |
| 韵律/语调 | 25% | 重音位置、语调曲线 |
| 流畅度 | 20% | 停顿、语速 |
| 连读/弱读 | 15% | 自然度（高级） |

#### 反馈界面

```
"I think so."
 ✅  ❌   ✅

/aɪ/ /θɪŋk/ /soʊ/
      ↑
  你的发音：/sɪŋk/
  问题：/θ/ 发成了 /s/
  提示：舌尖需要放在上下齿之间，不是贴在上齿龈
  [查看口型示范] [再试一次]
```

#### 中文母语者专项问题库

| 问题 | 混淆对 | 训练策略 |
|------|--------|---------|
| /θ/ vs /s/ | think/sink | 舌尖位置对比 |
| /ð/ vs /d/ | this/dis | 气流 vs 爆破对比 |
| /r/ vs /l/ | right/light | 舌头卷曲 vs 弹舌 |
| /v/ vs /w/ | vine/wine | 唇齿 vs 双唇对比 |
| /æ/ vs /e/ | bad/bed | 口腔开合度对比 |
| /ɪ/ vs /iː/ | ship/sheep | 长短元音对比 |
| /ʊ/ vs /uː/ | pull/pool | 长短元音对比 |
| 词尾辅音 | 吞音问题 | 尾辅音释放练习 |
| 重音 | record(n/v) | 重音位置切换 |

### 3.4 课程体系

#### 路线一：按音素进阶

```
Level 1 - 基础音素（4周）
├── Week 1: 元音 /iː/ /ɪ/ /e/ /æ/ /ɑː/ /ɒ/
├── Week 2: 元音 /ʊ/ /uː/ /ʌ/ /ɜːr/ /ə/ + 双元音
├── Week 3: 辅音 爆破音 + 鼻音 + 边音
└── Week 4: 辅音 摩擦音 + 破擦音

Level 2 - 中文难点攻克（3周）
├── Week 5: th 专项 /θ/ /ð/
├── Week 6: r/l 专项 + v/w 专项
└── Week 7: 元音对比专项

Level 3 - 连读与韵律（3周）
├── Week 8: 连读规则（辅+元、同辅音等）
├── Week 9: 弱读与缩读
└── Week 10: 句子重音与语调

Level 4 - 场景实战（持续更新）
├── 日常对话
├── 商务英语
└── 学术演讲
```

#### 路线二：按场景分类

| 场景 | 课程数 | 核心训练内容 |
|------|--------|-------------|
| 自我介绍 | 5 | 名字发音、基本信息句型 |
| 餐厅点餐 | 8 | 食物名称、礼貌用语 |
| 职场会议 | 10 | 商务术语、正式语调 |
| 旅游出行 | 8 | 方向、交通、酒店 |
| 电话/视频 | 6 | 清晰度、节奏控制 |
| 面试 | 10 | STAR 回答、流畅度 |

#### 每课结构（~15分钟）

1. **导入**（2min）：本课目标音素/场景介绍
2. **观察**（3min）：3D 口型示范 + 剖面讲解
3. **模仿**（3min）：单词级跟读练习
4. **对比**（2min）：易混淆对比训练
5. **实战**（3min）：句子/对话练习 + AI 评分
6. **复习**（2min）：生成今日单词卡入复习队列

---

## 4. 3D Avatar 技术方案对比

### 方案总览

| 方案 | 类型 | 口腔内部 | 实时性 | 成本 | 平台 | 推荐度 |
|------|------|---------|--------|------|------|--------|
| **Viseme + Three.js 自研** | 开源自研 | ✅ 可自定义 | ✅ 实时 | 低 | Web/跨平台 | ⭐⭐⭐⭐⭐ |
| Ready Player Me | 商用SDK | ❌ 仅外部 | ✅ 实时 | 中 | Web/Unity | ⭐⭐ |
| MetaHuman (Unreal) | 商用引擎 | ❌ 仅外部 | ✅ 实时 | 高 | 原生 | ⭐ |
| Rhubarb Lip Sync | 开源工具 | ❌ 仅外部 | ⚠️ 离线 | 低 | 跨平台 | ⭐⭐⭐ |
| Oculus Lipsync / Meta | SDK | ❌ 仅外部 | ✅ 实时 | 免费 | Quest/移动 | ⭐⭐ |
| JALI | 研究项目 | ⚠️ 有限 | ⚠️ 离线 | 低 | 离线渲染 | ⭐⭐ |
| 预录制视频 | 视频 | ✅ 可拍摄 | N/A | 高(制作) | 任意 | ⭐⭐⭐ |

### 推荐方案：Viseme 驱动 + Three.js 自研 3D 口腔模型

**理由**：

1. **口腔内部可视化是核心差异化**，Ready Player Me / MetaHuman 等方案只渲染面部外观，无法展示舌头和上颚
2. Three.js 方案可运行在 Web（React Native WebView 亦可），跨平台成本最低
3. 自研模型可精确控制每个音素对应的舌位、唇形、下颚角度

**实现路径**：

```
TTS 音频 → Viseme 序列提取 → Viseme→口腔参数映射 → Three.js 渲染

口腔参数（per viseme）:
- lip_round: 0-1      (嘴唇圆度)
- lip_open: 0-1       (开口度)
- jaw_angle: 0-30°    (下颚角度)
- tongue_tip_x/y: 归一化坐标
- tongue_body_x/y: 归一化坐标
- tongue_shape: [flat, curved, retroflex]
- teeth_visible: bool
- airflow_nasal: bool
```

**3D 模型需求**：
- 简化口腔解剖模型（~5000 polygons）
- 可变形网格（Morph Targets / Blend Shapes）
- 正面人脸模型 + 矢状剖面模型
- 资产格式：glTF 2.0

**Viseme 标准**：采用 Oculus 15-viseme 集或 Microsoft 22-viseme 集，扩展映射到 IPA 音素。

### 备选方案：混合方案

MVP 阶段可用预录制的口型视频（正面+剖面），配合简单的 2D 口腔剖面 SVG 动画，降低初期开发成本。V2 再升级到完整 3D。

---

## 5. 技术架构

```
┌─────────────────────────────────────────────────────┐
│                     客户端                           │
│  React Native (iOS/Android) + React (Web)           │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ 3D 渲染   │ │ 音频录制  │ │ 离线缓存/复习队列 │   │
│  │ Three.js  │ │ WebAudio │ │ SQLite/WatermelonDB│  │
│  └──────────┘ └──────────┘ └───────────────────┘   │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS / WebSocket
┌───────────────────────┴─────────────────────────────┐
│                   API Gateway                        │
│               (Nginx / Kong)                         │
└──┬──────────┬──────────┬──────────┬─────────────────┘
   │          │          │          │
┌──┴──┐  ┌───┴───┐  ┌───┴───┐  ┌──┴──────────┐
│用户  │  │课程   │  │ 复习  │  │  发音评估    │
│服务  │  │服务   │  │ 服务  │  │  服务(ML)    │
│Node  │  │Node   │  │Node   │  │  Python      │
└──┬──┘  └───┬───┘  └───┬───┘  └──┬──────────┘
   │         │          │          │
   └─────────┴─────┬────┘          │
                   │               │
            ┌──────┴──────┐  ┌─────┴────────┐
            │ PostgreSQL  │  │ ML Pipeline  │
            │ + Redis     │  │ Whisper ASR  │
            └─────────────┘  │ Montreal FA  │
                             │ 评分模型     │
                             └──────────────┘
```

### AI/ML 组件

| 组件 | 用途 | 技术选型 |
|------|------|---------|
| TTS | 生成参考发音 | Azure TTS / Edge TTS（免费） / Coqui TTS |
| Viseme 提取 | 音频→口型参数 | Azure Viseme API / Rhubarb / 自研CNN |
| ASR | 语音识别 | Whisper (large-v3) |
| 强制对齐 | 音素时间戳 | Montreal Forced Aligner (MFA) |
| 发音评分 | 音素准确度评估 | SpeechBrain / 自研模型 |
| 语调分析 | F0曲线对比 | Parselmouth (Praat) |

---

## 6. 数据库设计

### 6.1 核心表结构

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    native_language VARCHAR(10) DEFAULT 'zh-CN',
    level SMALLINT DEFAULT 1,  -- 1-10
    streak_days INT DEFAULT 0,
    daily_goal_minutes INT DEFAULT 15,
    subscription_tier VARCHAR(20) DEFAULT 'free', -- free/pro
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 音素表
CREATE TABLE phonemes (
    id SERIAL PRIMARY KEY,
    ipa_symbol VARCHAR(10) UNIQUE NOT NULL,  -- /θ/
    type VARCHAR(20) NOT NULL,  -- vowel/consonant/diphthong
    manner VARCHAR(30),  -- fricative/plosive/nasal...
    place VARCHAR(30),   -- dental/alveolar/bilabial...
    voiced BOOLEAN,
    difficulty_for_zh SMALLINT,  -- 1-5, 中文母语者难度
    description_zh TEXT,
    mouth_params JSONB  -- 3D口腔参数
);

-- 单词表
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    ipa VARCHAR(100) NOT NULL,
    phoneme_sequence VARCHAR(200),  -- 音素ID序列
    audio_url VARCHAR(500),
    viseme_data JSONB,  -- 口型动画关键帧数据
    definition_zh TEXT,
    difficulty SMALLINT,  -- 1-5
    frequency_rank INT,
    tags VARCHAR(200)[]  -- ['daily', 'business', 'travel']
);

-- 例句表
CREATE TABLE example_sentences (
    id SERIAL PRIMARY KEY,
    word_id INT REFERENCES words(id),
    sentence TEXT NOT NULL,
    highlight_indices INT[],  -- 目标词在句中的位置
    audio_url VARCHAR(500),
    translation_zh TEXT
);

-- 易混淆词对表
CREATE TABLE confusion_pairs (
    id SERIAL PRIMARY KEY,
    word_a_id INT REFERENCES words(id),
    word_b_id INT REFERENCES words(id),
    phoneme_contrast VARCHAR(20),  -- 如 "θ/s"
    explanation_zh TEXT
);

-- 课程表
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description_zh TEXT,
    type VARCHAR(20),  -- 'phoneme' / 'scenario'
    level SMALLINT,
    sort_order INT,
    estimated_minutes INT
);

-- 课程单元
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id),
    title VARCHAR(200),
    sort_order INT,
    content JSONB  -- 结构化的课程内容
);

-- 用户单词卡（SRS）
CREATE TABLE user_flashcards (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    word_id INT REFERENCES words(id),
    ease_factor REAL DEFAULT 2.5,
    interval_days INT DEFAULT 0,
    repetitions INT DEFAULT 0,
    next_review_at TIMESTAMPTZ,
    last_quality SMALLINT,  -- 0-5
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- 用户学习进度
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    lesson_id INT REFERENCES lessons(id),
    status VARCHAR(20) DEFAULT 'not_started', -- not_started/in_progress/completed
    score REAL,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, lesson_id)
);

-- 发音练习记录
CREATE TABLE pronunciation_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    word_id INT,
    sentence_id INT,
    audio_url VARCHAR(500),  -- 用户录音
    overall_score REAL,  -- 0-100
    phoneme_scores JSONB,  -- {"θ": 45, "ɪ": 90, ...}
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户每日统计
CREATE TABLE daily_stats (
    user_id UUID REFERENCES users(id),
    date DATE,
    minutes_practiced INT DEFAULT 0,
    words_reviewed INT DEFAULT 0,
    words_learned INT DEFAULT 0,
    avg_pronunciation_score REAL,
    PRIMARY KEY(user_id, date)
);
```

### 6.2 Redis 用途

- 用户会话 / JWT 黑名单
- 每日复习队列缓存
- 排行榜 (Sorted Set)
- 音频/Viseme 数据热缓存

---

## 7. API 设计

### 7.1 认证

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
```

### 7.2 用户

```
GET    /api/v1/users/me                    获取当前用户信息
PATCH  /api/v1/users/me                    更新设置
GET    /api/v1/users/me/stats              学习统计概览
GET    /api/v1/users/me/stats/daily?range=30d  每日统计
```

### 7.3 课程

```
GET    /api/v1/courses                     课程列表（支持 ?type=phoneme|scenario）
GET    /api/v1/courses/:id                 课程详情
GET    /api/v1/courses/:id/lessons         课程下所有课时
GET    /api/v1/lessons/:id                 课时详情（含内容）
POST   /api/v1/lessons/:id/complete        标记完成
```

### 7.4 单词与单词卡

```
GET    /api/v1/words/:id                   单词详情（含音标、音频、例句、口型数据）
GET    /api/v1/words/:id/viseme            获取口型动画数据
GET    /api/v1/words/:id/confusions        获取易混淆词对

GET    /api/v1/flashcards/review           获取今日待复习卡片
POST   /api/v1/flashcards/:id/review       提交复习结果 { quality: 0-5 }
POST   /api/v1/flashcards                  添加单词到复习队列
GET    /api/v1/flashcards/stats            复习统计
```

### 7.5 发音评估

```
POST   /api/v1/pronunciation/evaluate
  Body: multipart/form-data
    - audio: wav/webm 文件
    - reference_text: "I think so"
    - type: "word" | "sentence"
  Response:
    {
      "overall_score": 72,
      "phoneme_scores": [
        { "phoneme": "θ", "score": 35, "expected": "θ", "actual": "s" },
        { "phoneme": "ɪ", "score": 92, "expected": "ɪ", "actual": "ɪ" }
      ],
      "prosody_score": 68,
      "fluency_score": 80,
      "feedback": [
        {
          "phoneme": "θ",
          "issue": "substitution",
          "tip_zh": "舌尖需要放在上下齿之间，送出气流",
          "practice_words": ["think", "three", "both"]
        }
      ]
    }
```

### 7.6 音素与 3D 数据

```
GET    /api/v1/phonemes                    所有音素列表
GET    /api/v1/phonemes/:symbol            音素详情（含口腔参数）
GET    /api/v1/phonemes/:symbol/mouth-data 3D 口腔参数数据
```

---

## 8. 技术栈推荐

### 前端

| 层级 | 技术 | 理由 |
|------|------|------|
| 移动端 | React Native + Expo | 跨平台，生态成熟 |
| Web 端 | Next.js | SSR/SEO，共享组件 |
| 3D 渲染 | Three.js + React Three Fiber | Web 3D 标准，可嵌入 RN WebView |
| 音频处理 | Web Audio API + RecordRTC | 录音 + 实时音频可视化 |
| 本地存储 | WatermelonDB | 离线优先的 React Native 数据库 |
| 状态管理 | Zustand | 轻量，TypeScript 友好 |

### 后端

| 层级 | 技术 | 理由 |
|------|------|------|
| API 服务 | Node.js + Fastify | 高性能，TypeScript |
| ML 服务 | Python + FastAPI | ML 生态（PyTorch, Whisper） |
| 数据库 | PostgreSQL 16 | JSONB 支持，可靠 |
| 缓存 | Redis 7 | 会话、排行榜、队列 |
| 对象存储 | S3 / MinIO | 音频文件、3D 模型 |
| 消息队列 | BullMQ (Redis) | 异步发音评估任务 |

### ML/AI

| 组件 | 技术 |
|------|------|
| ASR | OpenAI Whisper large-v3 |
| 强制对齐 | Montreal Forced Aligner |
| TTS | Edge TTS (免费) / Azure TTS |
| Viseme | Azure Speech SDK / Rhubarb |
| 语调分析 | Parselmouth (Praat wrapper) |
| 发音评分 | SpeechBrain / 自研 fine-tuned 模型 |

### 部署

| 组件 | 方案 |
|------|------|
| 容器编排 | Docker + Docker Compose (初期) → Kubernetes |
| 云平台 | AWS / 阿里云（面向中国用户） |
| CDN | CloudFront / 阿里云 CDN |
| CI/CD | GitHub Actions |
| 监控 | Grafana + Prometheus |
| 日志 | ELK Stack / Loki |

---

## 9. 开源资源清单

### TTS（文字转语音）

| 项目 | 说明 | License |
|------|------|---------|
| [Coqui TTS](https://github.com/coqui-ai/TTS) | 多语言 TTS，可自托管 | MPL-2.0 |
| [Edge TTS](https://github.com/rany2/edge-tts) | 微软 Edge 在线 TTS（免费） | GPL-3.0 |
| [Piper](https://github.com/rhasspy/piper) | 快速本地 TTS | MIT |
| [VITS](https://github.com/jaywalnut310/vits) | 端到端 TTS | MIT |

### Lip Sync / Viseme

| 项目 | 说明 | License |
|------|------|---------|
| [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) | 音频→口型（6/9 viseme） | MIT |
| [Oculus Lipsync](https://developer.oculus.com/documentation/native/audio-ovrlipsync-native/) | Meta 官方 lip sync | 商用免费 |
| [Azure Speech Viseme](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-speech-synthesis-viseme) | 音频→22 viseme + blend shapes | 按量付费 |

### 语音评估 / 强制对齐

| 项目 | 说明 | License |
|------|------|---------|
| [Montreal Forced Aligner](https://montreal-forced-aligner.readthedocs.io/) | 音素级强制对齐 | MIT |
| [Whisper](https://github.com/openai/whisper) | OpenAI ASR | MIT |
| [SpeechBrain](https://github.com/speechbrain/speechbrain) | 语音处理工具包 | Apache-2.0 |
| [Parselmouth](https://github.com/YannickJadworker/Parselmouth) | Praat 的 Python 接口 | GPL-3.0 |
| [Kaldi](https://github.com/kaldi-asr/kaldi) | 语音识别工具包 | Apache-2.0 |
| [wav2vec 2.0](https://github.com/facebookresearch/fairseq) | 自监督语音表示 | MIT |

### 3D / 渲染

| 项目 | 说明 | License |
|------|------|---------|
| [Three.js](https://threejs.org/) | WebGL 3D 库 | MIT |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | Three.js React 封装 | MIT |
| [Ready Player Me](https://readyplayer.me/) | 3D 头像 SDK | 免费/商用 |
| [glTF](https://www.khronos.org/gltf/) | 3D 模型标准格式 | 开放标准 |

### 间隔重复

| 项目 | 说明 | License |
|------|------|---------|
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | FSRS 算法 TypeScript 实现 | MIT |
| [py-fsrs](https://github.com/open-spaced-repetition/py-fsrs) | FSRS 算法 Python 实现 | MIT |

---

## 10. 开发路线图

### Phase 0 — 验证期（1个月）

**目标**：技术可行性验证

- [ ] Three.js 口腔 3D 原型（5个元音的剖面动画）
- [ ] Whisper + MFA 发音评估 pipeline 原型
- [ ] Edge TTS → Rhubarb → Viseme 数据 pipeline
- [ ] 10 个单词的完整数据准备

### Phase 1 — MVP（2个月）

**目标**：核心体验闭环，内测

- [ ] 用户注册/登录
- [ ] 15 个基础音素课程（元音+辅音）
- [ ] 200 个核心单词卡（含音频+基础口型动画）
- [ ] 单词级发音评估（音素准确度评分）
- [ ] 基础 SRS 复习系统
- [ ] 2D 口腔剖面 SVG 动画（替代完整 3D）
- [ ] React Native App（iOS + Android）
- **技术里程碑**：发音评分准确率 >80%（与人工标注对比）

### Phase 2 — V1 正式版（3个月）

**目标**：产品完整，公测

- [ ] 完整 3D 口腔模型（正面+剖面双视角）
- [ ] 全部 44 个美式英语音素课程
- [ ] 1000+ 单词库
- [ ] 句子级发音评估（含语调、流畅度）
- [ ] 中文母语者专项课程（th, r/l, v/w 等）
- [ ] 易混淆词对比模式
- [ ] 学习数据统计与报告
- [ ] Pro 订阅与支付
- [ ] Web 版本
- **技术里程碑**：3D 模型 60fps 渲染，评估延迟 <3s

### Phase 3 — V2 增强版（4个月）

**目标**：差异化壁垒

- [ ] AI 对话练习（场景对话 + 实时发音反馈）
- [ ] 个性化学习路径（基于薄弱音素自动推荐）
- [ ] 社交功能（排行榜、打卡分享）
- [ ] 离线模式（核心课程+复习可离线使用）
- [ ] 更多场景课程（商务、旅游、面试等）
- [ ] 多口音支持（英式、澳式）
- [ ] 视频课程嵌入（真人教师讲解）

### 团队配置（建议）

| 阶段 | 人员 |
|------|------|
| MVP | 1 全栈 + 1 ML工程师 + 1 3D美术（兼职） |
| V1 | +1 前端 + 1 后端 + 1 内容运营 |
| V2 | +1 ML + 1 产品经理 |

---

## 附录 A：名词解释

| 术语 | 说明 |
|------|------|
| IPA | 国际音标 (International Phonetic Alphabet) |
| Viseme | 视位，口型的视觉表示单元 |
| Forced Alignment | 强制对齐，将音频与文本在音素级别对齐 |
| SRS | 间隔重复系统 (Spaced Repetition System) |
| SM-2 | SuperMemo 2 算法，经典间隔重复算法 |
| FSRS | Free Spaced Repetition Scheduler，新一代 SRS 算法 |
| ASR | 自动语音识别 (Automatic Speech Recognition) |
| TTS | 文字转语音 (Text-to-Speech) |
| VAD | 语音活动检测 (Voice Activity Detection) |
| F0 | 基频，语调分析的基础 |
| Morph Target | 变形目标，3D 动画中的混合形状技术 |
