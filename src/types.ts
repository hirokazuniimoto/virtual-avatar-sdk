/**
 * AvatarSpeaker の型定義
 */

export interface AvatarSpeakerOptions {
  /** VRMファイルパス or URL */
  avatar: string
  /** キャンバス要素またはコンテナ要素（未指定の場合は自動生成） */
  canvas?: HTMLCanvasElement | HTMLElement
  /** 字幕を表示する要素（未指定の場合は自動生成） */
  subtitleContainer?: HTMLElement
}

export interface AvatarSpeakerEventMap {
  ready: () => void
  error: (error: Error) => void
}

export type ExpressionType = 'joy' | 'fun' | 'neutral'

export type AudioSource = AudioBuffer | HTMLAudioElement | string

export interface AvatarSpeakerEventMap {
  ready: () => void
  error: (error: Error) => void
}

