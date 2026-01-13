# デフォルトアセット

このディレクトリには、AvatarSpeakerで使用できるデフォルトのアバターとアニメーションファイルが含まれています。

## アバター

- `avatars/anime.vrm` - アニメ調のアバター
- `avatars/human.vrm` - リアル寄りのアバター
- `avatars/robot.vrm` - 非人型のアバター

## アニメーション

- `animations/idle.vrma` - 待機アニメーション（T字ポーズ防止用）
- `animations/bow.vrma` - お辞儀アニメーション
- `animations/wave.vrma` - 手を振るアニメーション

## 使用方法

これらのアセットを使用するには、プロジェクトの`public`フォルダなどにコピーして使用してください。

```typescript
import { AvatarSpeaker } from "virtual-avatar"

const ai = new AvatarSpeaker({
  avatar: "/avatars/anime.vrm"  // public/avatars/anime.vrm にコピーした場合
})

await ai.ready()
await ai.animate("/vrma/bow.vrma")  // public/vrma/bow.vrma にコピーした場合
```

