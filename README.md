# AvatarSpeaker

Web向け・軽量アバターランタイム

アバターに詳しくないWeb開発者でも「喋るアバター体験」を最短で実装できることを目的としたライブラリです。

## 特徴

- **three.js / three-vrm の知識不要** - 高レベルなAPIのみ提供
- **シンプルなAPI** - 10個以下のメソッドで完結
- **自動機能** - 常時瞬き、idleアニメーション、T字ポーズ防止が自動
- **失敗しても壊れない** - エラーは警告のみ、例外を投げない設計

## インストール

```bash
npm install avatar-speaker
```

## 開発サーバーの起動

ESモジュールを使用するため、`file://` プロトコルでは動作しません。ローカル開発サーバーを起動してください：

```bash
npm run serve
```

ブラウザで `http://localhost:3000/examples/basic.html` にアクセスしてください。

その他の方法：
- Python: `python -m http.server 3000`
- Node.js: `npx serve . -p 3000`
- VS Code: Live Server 拡張機能を使用

## 基本的な使い方

```typescript
import { AvatarSpeaker } from "avatar-speaker"

const ai = new AvatarSpeaker({
  avatar: "/avatars/anime.vrm"
})

await ai.ready()

ai.say("こんにちは")
```

これだけで：
- VRMロード
- idleアニメーション適用
- 常時瞬き開始
- 字幕表示
- 口パク開始／終了

がすべて自動で行われる。

## API

### 初期化

```typescript
const ai = new AvatarSpeaker({
  avatar: string   // VRMファイルパス or URL
})
```

### ロード完了通知

**Promise方式（推奨）**
```typescript
await ai.ready()
```

**イベント方式**
```typescript
ai.on("ready", () => {
  hideLoading()
})
```

`ready` は以下がすべて完了した時点で発火：
- VRMロード完了
- idleアニメーション適用
- 瞬き開始
- 初期レンダリング安定

### 発話（口パク + 字幕）

**テキストのみ**
```typescript
ai.say("こんにちは")
```
音声なしでも「喋っている風」を再現。テキストから母音比率を推定し簡易口形制御。

**音声あり**
```typescript
ai.say("こんにちは", { audio })
```
`audio`: `AudioBuffer` / `HTMLAudioElement` / 音声ファイルURL

音声再生に同期して口パク。

### 表情・ジェスチャー（プリセット）

```typescript
ai.smile()
ai.bow()
```

対応Expression / Animationがある場合のみ再生。存在しない場合は `console.warn` のみで例外は投げない。

### アニメーション（カスタム）

```typescript
ai.animate("/motions/wave.vrma")
```

指定したファイルをロード＋即再生。初回のみ内部ロード、以降はキャッシュ。

対応形式：
- `.vrma`（推奨）
- `.glb`（experimental）

### アバター切り替え

```typescript
ai.setAvatar("/avatars/robot.vrm")
```

### クリーンアップ

```typescript
ai.destroy()
```

## デフォルト挙動

### 常時瞬き（Blink）

アバターは常に自動で瞬き。発話・アニメーションの有無に依存しない。ランダム間隔で自然な瞬き。対応Expressionが無い場合は自動無効化。

### T字防止（デフォルトidle）

VRMロード完了時に必ず idle アニメーションを再生。T字ポーズを防止。idleが無い場合は warn のみ。

## 初期化フロー

```
new AvatarSpeaker()
↓
VRMロード
↓
表情初期化
↓
瞬き開始
↓
idleアニメーション適用
↓
レンダリング安定
↓
ready イベント発火
```

## デフォルトアセット

本パッケージには以下のデフォルトアセットが同梱されています：

**デフォルトアバター（3体）**
- `assets/avatars/anime.vrm`（アニメ調）
- `assets/avatars/human.vrm`（リアル寄り）
- `assets/avatars/robot.vrm`（非人型）

**デフォルトアニメーション**
- `assets/animations/idle.vrma` - 待機アニメーション
- `assets/animations/bow.vrma` - お辞儀
- `assets/animations/wave.vrma` - 手を振る

使用例：
```typescript
// デフォルトアバターを使用
const ai = new AvatarSpeaker({
  avatar: "node_modules/avatar-speaker/assets/avatars/anime.vrm"
})

// デフォルトアニメーションを使用
await ai.animate("node_modules/avatar-speaker/assets/animations/bow.vrma")
```

> **注意**: 実際の使用時は、アセットをプロジェクトの`public`フォルダなどにコピーして使用することを推奨します。

## three-vrmとの差別化

| three-vrm | AvatarSpeaker |
|-----------|--------------|
| VRMをどう操作するか | アバターに何をさせるか |
| 低レベルAPI | 高レベル命令型API |
| 実装負担が高い | 即動く |
| 初期姿勢は自前 | idle & blink自動 |

## 設計思想

- APIは 10個以下
- 命令型（imperative）
- 失敗しても壊れない
- 精度より「それっぽさ」
- three-vrmの存在を意識させない
- 初心者が 3分で成功体験

## ライセンス

MIT

