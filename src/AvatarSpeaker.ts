/**
 * AvatarSpeaker
 */

import { VRMRenderer } from './VRMRenderer'
import { LipSync } from './LipSync'
import { ExpressionManager } from './ExpressionManager'
import { AnimationManager } from './AnimationManager'
import { BlinkController } from './BlinkController'
import { SubtitleRenderer } from './SubtitleRenderer'
import type { AvatarSpeakerOptions, ExpressionType, AudioSource, AvatarSpeakerEventMap } from './types'

export class AvatarSpeaker {
  private renderer: VRMRenderer
  private lipSync: LipSync
  private expressionManager: ExpressionManager
  private animationManager: AnimationManager
  private blinkController: BlinkController
  private subtitleRenderer: SubtitleRenderer
  private eventListeners: Map<string, Set<Function>> = new Map()
  private isReady: boolean = false
  private readyPromise: Promise<void>
  private readyResolve?: () => void
  private expressionTimer: number | null = null

  constructor(options: AvatarSpeakerOptions) {
    this.eventListeners.set('ready', new Set())
    this.eventListeners.set('error', new Set())

    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve
    })

    this.renderer = new VRMRenderer(options.avatar, options.canvas)
    this.lipSync = new LipSync(this.renderer)
    this.expressionManager = new ExpressionManager(this.renderer)
    this.animationManager = new AnimationManager(this.renderer)
    this.blinkController = new BlinkController(this.renderer)
    this.subtitleRenderer = new SubtitleRenderer(options.subtitleContainer)

    this.renderer.on('error', (error: Error) => {
      this.emit('error', error)
    })

    this.initialize()
  }

  /**
   * initialize avatar speaker
   */
  private async initialize() {
    try {
      await this.renderer.load()
      
      this.expressionManager.initialize()
      
      this.blinkController.start()
      
      await this.animationManager.ensureIdle()
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      this.isReady = true
      this.readyResolve?.()
      this.emit('ready')
    } catch (error) {
      this.emit('error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  /**
   * wait for ready
   */
  async ready(): Promise<void> {
    return this.readyPromise
  }

  /**
   * register event listener
   */
  on<K extends keyof AvatarSpeakerEventMap>(
    event: K,
    listener: AvatarSpeakerEventMap[K]
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(listener)
  }

  /**
   * remove event listener
   */
  off<K extends keyof AvatarSpeakerEventMap>(
    event: K,
    listener: AvatarSpeakerEventMap[K]
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  private emit<K extends keyof AvatarSpeakerEventMap>(
    event: K,
    ...args: Parameters<AvatarSpeakerEventMap[K]>
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          ;(listener as any)(...args)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  /**
   * say
   * 
   * @param text text to say
   * @param options options (audio: audio data)
   */
  async say(text: string, options?: { audio?: AudioSource }): Promise<void> {
    if (!this.isReady) {
      await this.ready()
    }

    this.subtitleRenderer.show(text)

    // if audio is provided, say with audio
    if (options?.audio) {
      await this.sayWithAudio(text, options.audio)
    } else {
      // if audio is not provided, say with text
      await this.sayWithoutAudio(text)
    }
  }

  private async sayWithAudio(text: string, audio: AudioSource): Promise<void> {
    let audioElement: HTMLAudioElement | null = null

    try {
      if (audio instanceof HTMLAudioElement) {
        audioElement = audio
      } else if (audio instanceof AudioBuffer) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioCtx.createBufferSource()
        source.buffer = audio
        const dest = audioCtx.createMediaStreamDestination()
        source.connect(dest)
        source.start()
        
        audioElement = new Audio()
        audioElement.srcObject = dest.stream
      } else if (typeof audio === 'string') {
        audioElement = new Audio(audio)
      }

      if (!audioElement) {
        throw new Error('Invalid audio source')
      }

      this.lipSync.start()

      await new Promise<void>((resolve, reject) => {
        audioElement!.onended = () => {
          this.lipSync.stop()
          this.subtitleRenderer.hide()
          resolve()
        }
        audioElement!.onerror = () => {
          this.lipSync.stop()
          this.subtitleRenderer.hide()
          reject(new Error('Audio playback failed'))
        }
        audioElement!.play().catch(reject)
      })
    } catch (error) {
      this.lipSync.stop()
      this.subtitleRenderer.hide()
      throw error
    }
  }

  private async sayWithoutAudio(text: string): Promise<void> {
    const duration = this.estimateSpeechDuration(text)
    
    this.lipSync.start()
    
    await new Promise(resolve => setTimeout(resolve, duration))
    
    this.lipSync.stop()
    this.subtitleRenderer.hide()
  }

  private estimateSpeechDuration(text: string): number {
    const japaneseChars = (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g) || []).length
    const englishWords = text.split(/\s+/).filter(w => /^[a-zA-Z]+$/.test(w)).length
    return Math.max(1000, japaneseChars * 100 + englishWords * 500)
  }

  /**
   * set expression
   * @param duration expression duration (milliseconds). default is 1000ms (1 second)
   */
  smile(duration: number = 1000): void {
    if (!this.isReady) {
      console.warn('AvatarSpeaker is not ready yet')
      return
    }
    
    if (this.expressionTimer) {
      clearTimeout(this.expressionTimer)
      this.expressionTimer = null
    }
    
    this.expressionManager.setJoy(1)
    
    // reset the expression after a certain time
    this.expressionTimer = setTimeout(() => {
      this.expressionManager.setNeutral()
      this.expressionTimer = null
    }, duration)
  }

  /**
   * bow
   */
  async bow(): Promise<void> {
    if (!this.isReady) {
      console.warn('AvatarSpeaker is not ready yet')
      return
    }
    await this.animationManager.playAnimation('/assets/animations/quick_formal_bow.vrma')
  }

  /**
   * play animation
   * 
   * @param path animation file path ( .vrma or .glb )
   */
  async animate(path: string): Promise<void> {
    if (!this.isReady) {
      console.warn('AvatarSpeaker is not ready yet')
      return
    }
    await this.animationManager.playAnimation(path)
  }

  /**
   * set avatar
   * 
   * @param avatarPath new VRM file path
   */
  async setAvatar(avatarPath: string): Promise<void> {
    await this.renderer.loadVRM(avatarPath)
    this.expressionManager.initialize()
    this.blinkController.start()
    await this.animationManager.ensureIdle()
  }

  /**
   * clean up
   */
  destroy(): void {
    // clean up the expression timer
    if (this.expressionTimer !== null) {
      clearTimeout(this.expressionTimer)
      this.expressionTimer = null
    }
    
    this.blinkController.stop()
    this.lipSync.stop()
    this.animationManager.destroy()
    this.renderer.destroy()
    this.subtitleRenderer.destroy()
    this.eventListeners.clear()
  }
}

// re-export types
export type { AvatarSpeakerOptions, ExpressionType, AudioSource, AvatarSpeakerEventMap } from './types'

