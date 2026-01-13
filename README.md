# Virtual Avatar SDK (for Virtual AI Avatar)

[English](#english) | [日本語](#日本語)

---

<a name="english"></a>
## English

### What is Virtual Avatar SDK?

Virtual Avatar SDK is a lightweight, web-based runtime library for creating interactive 3D avatar experiences. It provides a simple, high-level API that allows developers to easily implement speaking avatars with facial expressions, animations, and lip-sync capabilities without deep knowledge of 3D graphics or VRM format. It also makes it easy to build AI Avatar.

### Features

- **Easy to Use** - Simple API with minimal setup required
- **Expression Control** - Control avatar facial expressions (happy, angry, sad, fun)
- **Animation Playback** - Play custom VRM animations (.vrma files)
- **Text-to-Speech** - Display subtitles and lip-sync from text input
- **Audio Support** - Synchronize lip-sync with audio playback
- **Auto Features** - Automatic blinking and idle animations

### Installation

Install via npm:

```bash
npm install virtual-avatar
```

This will automatically install all required dependencies including `three`, `@pixiv/three-vrm`, and `@pixiv/three-vrm-animation`.

### Setup

**For npm users (recommended):**

```typescript
import { AvatarSpeaker } from "virtual-avatar"

const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})
```

**For direct usage (without npm):**

If you're using the SDK directly from the repository:

1. Clone or download this repository
2. Install dependencies and build the SDK:
```bash
npm install
npm run build
```
3. Copy the SDK code (`dist` folder) and assets (`assets` folder) to your project
4. Set up import maps for dependencies (three.js and related libraries):
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.4.4/lib/three-vrm.module.js",
    "@pixiv/three-vrm-animation": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm-animation@3.4.4/lib/three-vrm-animation.module.js"
  }
}
</script>
```
5. Import and use the `AvatarSpeaker` class:
```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"
```

The package includes default avatars and animations in the `assets` folder, which you can use immediately in your projects.

### Quick Start

**HTML Example:**
```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.4.4/lib/three-vrm.module.js",
      "@pixiv/three-vrm-animation": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm-animation@3.4.4/lib/three-vrm-animation.module.js"
    }
  }
  </script>
</head>
<body>
  <div id="avatar-container"></div>
  
  <script type="module">
    import { AvatarSpeaker } from "./dist/index.esm.js"

    const avatar = new AvatarSpeaker({
      avatar: "/assets/avatars/AvatarSample_A.vrm",
      canvas: document.querySelector("#avatar-container")
    })

    await avatar.ready()

    // Make the avatar speak(without audio)
    avatar.say("Hello, world!")

    // Set expressions
    avatar.smile()    // Happy expression
    avatar.angry()    // Angry expression
    avatar.sad()      // Sad expression
    avatar.fun()      // Fun expression

    // Play animations
    await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")
  </script>
</body>
</html>
```

**TypeScript/JavaScript Module Example:**
```typescript
// When using with bundlers (webpack, vite, etc.), install dependencies:
// npm install three @pixiv/three-vrm @pixiv/three-vrm-animation

import { AvatarSpeaker } from "./dist/index.esm.js"

const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})

await avatar.ready()

// Make the avatar speak(without audio)
avatar.say("Hello, world!")

// Set expressions
avatar.smile()    // Happy expression
avatar.angry()    // Angry expression
avatar.sad()      // Sad expression
avatar.fun()      // Fun expression

// Play animations
await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")
```

### Supported File Formats

- **VRM** (`.vrm`) - 3D avatar models
- **VRM Animation** (`.vrma`) - Animation files (recommended)

### API Reference

#### Initialization

```typescript
const avatar = new AvatarSpeaker({
  avatar: string,              // VRM file path or URL
  canvas?: HTMLCanvasElement,  // Optional canvas element
  subtitleContainer?: HTMLElement  // Optional subtitle container
})
```

#### Wait for Ready

```typescript
await avatar.ready()
```

#### Speech

```typescript
// Text only (with auto lip-sync)
avatar.say("Hello, world!")

// With audio
avatar.say("Hello, world!", { 
  audio: audioElement | audioBuffer | audioUrl 
})
```

#### Expressions

All expression methods accept an optional `duration` parameter (default: 1000ms). The expression will automatically reset to neutral after the specified duration.

```typescript
avatar.smile(duration?: number)   // Happy expression
avatar.angry(duration?: number)  // Angry expression
avatar.sad(duration?: number)   // Sad expression
avatar.fun(duration?: number)    // Fun expression
avatar.neutral()                  // Reset to neutral immediately
```

#### Animations

```typescript
await avatar.animate(path: string)  // Play animation from file path
await avatar.idle()                 // Play idle animation (preset)
await avatar.bow()                  // Play bow animation (preset)
```

#### Avatar Management

```typescript
await avatar.setAvatar(path: string)  // Switch avatar
avatar.destroy()                       // Cleanup resources
```

### Building an AI Avatar with ChatGPT API

Here's a example of building an interactive AI avatar that uses ChatGPT API for conversation and text-to-speech for voice synthesis:

```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"

// Initialize avatar
const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm",
  canvas: document.querySelector("#avatar-container"),
  subtitleContainer: document.querySelector("#subtitle-container")
})

await avatar.ready()

// ChatGPT API integration
async function chatWithAvatar(userMessage: string) {
  try {
    // 1. Get response from ChatGPT API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a friendly AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    })

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // 2. Convert text to speech using OpenAI TTS API
    const audioResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "tts-1",
        input: aiResponse,
        voice: "alloy" // Options: alloy, echo, fable, onyx, nova, shimmer
      })
    })

    const audioBlob = await audioResponse.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    // 3. Make avatar speak with audio and lip-sync
    await avatar.say(aiResponse, { audio })

    // Cleanup
    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audioUrl)
    })
  } catch (error) {
    console.error("Error:", error)
    // Fallback: text-only speech
    avatar.say("Sorry, I encountered an error.")
  }
}

// Example usage
document.querySelector("#chat-button").addEventListener("click", async () => {
  const input = document.querySelector("#user-input")
  const message = input.value
  input.value = ""
  
  // Show thinking animation
  await avatar.animate("/assets/animations/VRMA_06(モデルポーズ).vrma")
  
  // Chat with avatar
  await chatWithAvatar(message)
})

// Add expressions based on conversation context
avatar.smile() // Happy response
await chatWithAvatar("Tell me a joke!")
```

**Key Points:**
- Use ChatGPT API to generate conversational responses
- Use OpenAI TTS API (or other TTS services) to convert text to speech
- Pass the audio to `avatar.say()` for synchronized lip-sync
- Combine with expressions and animations for more natural interactions

### Default Assets

This package includes default assets from official VRoid sources. These assets are ready to use and can be referenced directly from the `assets` folder.

#### Default Avatars (3 types)

Official sample models from [VRoid Studio](https://hub.vroid.com/):

- `assets/avatars/AvatarSample_A.vrm` - Sample character A
- `assets/avatars/AvatarSample_B.vrm` - Sample character B
- `assets/avatars/AvatarSample_C.vrm` - Sample character C

**Usage Example:**
```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"

// Use default avatar A
const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})

await avatar.ready()

// Switch to another default avatar
await avatar.setAvatar("/assets/avatars/AvatarSample_B.vrm")
```

#### Default Animations

**Preset Animations:**
- `assets/animations/standard_idle.vrma` - Idle animation (automatically played on initialization)
- `assets/animations/quick_formal_bow.vrma` - Bow animation

**VRM Animation Pack (7 types):**

Official VRM animations from [VRoid Hub](https://booth.pm/ja/items/5512385):

- `assets/animations/VRMA_01(全身を見せる).vrma` - Full body showcase
- `assets/animations/VRMA_02(挨拶).vrma` - Greeting
- `assets/animations/VRMA_03(Vサイン).vrma` - V-sign
- `assets/animations/VRMA_04(撃つ).vrma` - Shooting pose
- `assets/animations/VRMA_05(回る).vrma` - Spinning
- `assets/animations/VRMA_06(モデルポーズ).vrma` - Model pose
- `assets/animations/VRMA_07(屈伸運動).vrma` - Squat exercise

**Usage Examples:**
```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"

const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})

await avatar.ready()

// Play preset animations
await avatar.bow()  // Uses quick_formal_bow.vrma
await avatar.idle() // Uses standard_idle.vrma

// Play custom animations from the pack
await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")  // Greeting
await avatar.animate("/assets/animations/VRMA_03(Vサイン).vrma") // V-sign
await avatar.animate("/assets/animations/VRMA_05(回る).vrma")    // Spinning

// Combine with expressions
avatar.smile()
await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")
```

### License

MIT

---

<a name="日本語"></a>
## 日本語

### Virtual Avatar SDKとは？

Virtual Avatar SDKは、インタラクティブな3Dアバター体験を作成するための軽量なWeb向けランタイムライブラリです。3DグラフィックスやVRM形式の深い知識がなくても、表情、アニメーション、リップシンク機能を備えた話すアバターを簡単に実装できるシンプルな高レベルAPIを提供します。またAIアバターの構築を簡単に行えます。

### 機能

- **簡単に使える** - 最小限のセットアップで使用可能なシンプルなAPI
- **表情制御** - アバターの表情を制御（笑顔、怒り、悲しみ、楽しい）
- **アニメーション再生** - カスタムVRMアニメーション（.vrmaファイル）を再生
- **テキスト読み上げ** - テキスト入力から字幕とリップシンクを表示
- **音声対応** - 音声再生と同期したリップシンク
- **自動機能** - 自動瞬きとidleアニメーション

### インストール

npm経由でインストール：

```bash
npm install virtual-avatar
```

これにより、`three`、`@pixiv/three-vrm`、`@pixiv/three-vrm-animation`を含むすべての必要な依存関係が自動的にインストールされます。

### セットアップ

**npmを使用する場合（推奨）:**

```typescript
import { AvatarSpeaker } from "virtual-avatar"

const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})
```

**直接使用する場合（npmを使用しない）:**

リポジトリから直接SDKを使用する場合：

1. このリポジトリをクローンまたはダウンロードする
2. 依存関係をインストールしてSDKをビルドする：
```bash
npm install
npm run build
```
3. SDKコード（`dist`フォルダ）とアセット（`assets`フォルダ）をプロジェクトにコピーする
4. 依存関係（three.jsと関連ライブラリ）のimport mapを設定する：
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.4.4/lib/three-vrm.module.js",
    "@pixiv/three-vrm-animation": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm-animation@3.4.4/lib/three-vrm-animation.module.js"
  }
}
</script>
```
5. `AvatarSpeaker`クラスをインポートして使用する：
```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"
```

パッケージには`assets`フォルダにデフォルトのアバターとアニメーションが含まれており、プロジェクトで即座に使用できます。

### クイックスタート

**HTMLの例:**
```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.4.4/lib/three-vrm.module.js",
      "@pixiv/three-vrm-animation": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm-animation@3.4.4/lib/three-vrm-animation.module.js"
    }
  }
  </script>
</head>
<body>
  <div id="avatar-container"></div>
  
  <script type="module">
    import { AvatarSpeaker } from "./dist/index.esm.js"

    const avatar = new AvatarSpeaker({
      avatar: "/assets/avatars/AvatarSample_A.vrm",
      canvas: document.querySelector("#avatar-container")
    })

    await avatar.ready()

    // アバターを話させる（音声無し）
    avatar.say("こんにちは、世界！")

    // 表情を設定
    avatar.smile()    // 笑顔
    avatar.angry()    // 怒り
    avatar.sad()      // 悲しみ
    avatar.fun()      // 楽しい

    // アニメーションを再生
    await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")
  </script>
</body>
</html>
```

**TypeScript/JavaScriptモジュールの例:**
```typescript
// バンドラー（webpack、viteなど）を使用する場合、依存関係をインストール:
// npm install three @pixiv/three-vrm @pixiv/three-vrm-animation

import { AvatarSpeaker } from "./dist/index.esm.js"

const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})

await avatar.ready()

// アバターを話させる（音声無し）
avatar.say("こんにちは、世界！")

// 表情を設定
avatar.smile()    // 笑顔
avatar.angry()    // 怒り
avatar.sad()      // 悲しみ
avatar.fun()      // 楽しい

// アニメーションを再生
await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")
```

### 対応ファイル形式

- **VRM** (`.vrm`) - 3Dアバターモデル
- **VRMアニメーション** (`.vrma`) - アニメーションファイル（推奨）

### APIリファレンス

#### 初期化

```typescript
const avatar = new AvatarSpeaker({
  avatar: string,              // VRMファイルパスまたはURL
  canvas?: HTMLCanvasElement,  // オプション：キャンバス要素
  subtitleContainer?: HTMLElement  // オプション：字幕コンテナ
})
```

#### ロード完了を待つ

```typescript
await avatar.ready()
```

#### 発話

```typescript
// テキストのみ（自動リップシンク付き）
avatar.say("こんにちは、世界！")

// 音声付き
avatar.say("こんにちは、世界！", { 
  audio: audioElement | audioBuffer | audioUrl 
})
```

#### 表情

すべての表情メソッドはオプションの`duration`パラメータ（デフォルト：1000ms）を受け取ります。指定時間後に自動的にニュートラルな表情に戻ります。

```typescript
avatar.smile(duration?: number)   // 笑顔
avatar.angry(duration?: number)   // 怒り
avatar.sad(duration?: number)     // 悲しみ
avatar.fun(duration?: number)     // 楽しい
avatar.neutral()                   // 即座にニュートラルに戻す
```

#### アニメーション

```typescript
await avatar.animate(path: string)  // ファイルパスからアニメーションを再生
await avatar.idle()                 // 待機アニメーションを再生（プリセット）
await avatar.bow()                  // お辞儀アニメーションを再生（プリセット）
```

#### アバター管理

```typescript
await avatar.setAvatar(path: string)  // アバターを切り替え
avatar.destroy()                       // リソースをクリーンアップ
```

### ChatGPT APIを使ったAIアバターの構築

ChatGPT APIと組み合わせて、会話機能付きのAIアバターを構築する例：

```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"

// アバターの初期化
const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm",
  canvas: document.querySelector("#avatar-container"),
  subtitleContainer: document.querySelector("#subtitle-container")
})

await avatar.ready()

// ChatGPT APIとの統合
async function chatWithAvatar(userMessage: string) {
  try {
    // 1. ChatGPT APIから応答を取得
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "あなたは親しみやすいAIアシスタントです。" },
          { role: "user", content: userMessage }
        ]
      })
    })

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // 2. OpenAI TTS APIを使用してテキストを音声に変換
    const audioResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "tts-1",
        input: aiResponse,
        voice: "alloy" // オプション: alloy, echo, fable, onyx, nova, shimmer
      })
    })

    const audioBlob = await audioResponse.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    // 3. 音声とリップシンク付きでアバターを話させる
    await avatar.say(aiResponse, { audio })

    // クリーンアップ
    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audioUrl)
    })
  } catch (error) {
    console.error("エラー:", error)
    // フォールバック: テキストのみの発話
    avatar.say("申し訳ございません。エラーが発生しました。")
  }
}

// 使用例
document.querySelector("#chat-button").addEventListener("click", async () => {
  const input = document.querySelector("#user-input")
  const message = input.value
  input.value = ""
  
  // 考えているアニメーションを表示
  await avatar.animate("/assets/animations/VRMA_06(モデルポーズ).vrma")
  
  // アバターとチャット
  await chatWithAvatar(message)
})

// 会話の文脈に応じて表情を追加
avatar.smile() // 嬉しい応答
await chatWithAvatar("ジョークを教えて！")
```

**ポイント:**
- ChatGPT APIを使用して会話応答を生成
- OpenAI TTS API（または他のTTSサービス）を使用してテキストを音声に変換
- 音声を`avatar.say()`に渡してリップシンクを同期
- 表情やアニメーションと組み合わせてより自然な対話を実現

### デフォルトアセット

このパッケージには、公式VRoidソースからのデフォルトアセットが含まれています。これらのアセットはすぐに使用でき、`assets`フォルダから直接参照できます。

#### デフォルトアバター（3種類）

[VRoid Studio](https://hub.vroid.com/)の公式サンプルモデル：

- `assets/avatars/AvatarSample_A.vrm` - サンプルキャラクターA
- `assets/avatars/AvatarSample_B.vrm` - サンプルキャラクターB
- `assets/avatars/AvatarSample_C.vrm` - サンプルキャラクターC

**使用例:**
```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"

// デフォルトアバターAを使用
const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})

await avatar.ready()

// 別のデフォルトアバターに切り替え
await avatar.setAvatar("/assets/avatars/AvatarSample_B.vrm")
```

#### デフォルトアニメーション

**プリセットアニメーション:**
- `assets/animations/standard_idle.vrma` - 待機アニメーション（初期化時に自動再生）
- `assets/animations/quick_formal_bow.vrma` - お辞儀アニメーション

**VRMアニメーションパック（7種類）:**

[VRoid Hub](https://booth.pm/ja/items/5512385)の公式VRMアニメーション：

- `assets/animations/VRMA_01(全身を見せる).vrma` - 全身を見せる
- `assets/animations/VRMA_02(挨拶).vrma` - 挨拶
- `assets/animations/VRMA_03(Vサイン).vrma` - Vサイン
- `assets/animations/VRMA_04(撃つ).vrma` - 撃つポーズ
- `assets/animations/VRMA_05(回る).vrma` - 回転
- `assets/animations/VRMA_06(モデルポーズ).vrma` - モデルポーズ
- `assets/animations/VRMA_07(屈伸運動).vrma` - 屈伸運動

**使用例:**
```typescript
import { AvatarSpeaker } from "./dist/index.esm.js"

const avatar = new AvatarSpeaker({
  avatar: "/assets/avatars/AvatarSample_A.vrm"
})

await avatar.ready()

// プリセットアニメーションを再生
await avatar.bow()  // quick_formal_bow.vrmaを使用
await avatar.idle() // standard_idle.vrmaを使用

// パックからカスタムアニメーションを再生
await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")  // 挨拶
await avatar.animate("/assets/animations/VRMA_03(Vサイン).vrma") // Vサイン
await avatar.animate("/assets/animations/VRMA_05(回る).vrma")    // 回転

// 表情と組み合わせる
avatar.smile()
await avatar.animate("/assets/animations/VRMA_02(挨拶).vrma")
```


### ライセンス

MIT
