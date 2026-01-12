# Virtual AI Avatar SDK

[English](#english) | [日本語](#日本語)

---

<a name="english"></a>
## English

### What is Virtual AI Avatar SDK?

Virtual AI Avatar SDK is a lightweight, web-based runtime library for creating interactive 3D avatar experiences. It provides a simple, high-level API that allows developers to easily implement speaking avatars with facial expressions, animations, and lip-sync capabilities without deep knowledge of 3D graphics or VRM format.

### Features

- **Easy to Use** - Simple API with minimal setup required
- **Expression Control** - Control avatar facial expressions (happy, angry, sad, fun)
- **Animation Playback** - Play custom VRM animations (.vrma files)
- **Text-to-Speech** - Display subtitles and lip-sync from text input
- **Audio Support** - Synchronize lip-sync with audio playback
- **Auto Features** - Automatic blinking and idle animations

### Installation

```bash
npm install avatar-speaker
```

### Quick Start

```typescript
import { AvatarSpeaker } from "avatar-speaker"

const avatar = new AvatarSpeaker({
  avatar: "/avatars/anime.vrm"
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
await avatar.animate("/animations/wave.vrma")
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

### Default Assets

This package includes default assets from official VRoid sources:

#### Default Avatars (3 types)

Official sample models from [VRoid Studio](https://hub.vroid.com/):

- `assets/avatars/AvatarSample_A.vrm` - Sample character A
- `assets/avatars/AvatarSample_B.vrm` - Sample character B
- `assets/avatars/AvatarSample_C.vrm` - Sample character C

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

### License

MIT

---

<a name="日本語"></a>
## 日本語

### Virtual AI Avatar SDKとは？

Virtual AI Avatar SDKは、インタラクティブな3Dアバター体験を作成するための軽量なWeb向けランタイムライブラリです。3DグラフィックスやVRM形式の深い知識がなくても、表情、アニメーション、リップシンク機能を備えた話すアバターを簡単に実装できるシンプルな高レベルAPIを提供します。

### 機能

- **簡単に使える** - 最小限のセットアップで使用可能なシンプルなAPI
- **表情制御** - アバターの表情を制御（笑顔、怒り、悲しみ、楽しい）
- **アニメーション再生** - カスタムVRMアニメーション（.vrmaファイル）を再生
- **テキスト読み上げ** - テキスト入力から字幕とリップシンクを表示
- **音声対応** - 音声再生と同期したリップシンク
- **自動機能** - 自動瞬きとidleアニメーション

### インストール

```bash
npm install avatar-speaker
```

### クイックスタート

```typescript
import { AvatarSpeaker } from "avatar-speaker"

const avatar = new AvatarSpeaker({
  avatar: "/avatars/anime.vrm"
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
await avatar.animate("/animations/wave.vrma")
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

### デフォルトアセット

このパッケージには、公式VRoidソースからのデフォルトアセットが含まれています：

#### デフォルトアバター（3種類）

[VRoid Studio](https://hub.vroid.com/)の公式サンプルモデル：

- `assets/avatars/AvatarSample_A.vrm` - サンプルキャラクターA
- `assets/avatars/AvatarSample_B.vrm` - サンプルキャラクターB
- `assets/avatars/AvatarSample_C.vrm` - サンプルキャラクターC

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


### ライセンス

MIT
