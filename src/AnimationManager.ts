/**
 * AnimationManager
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation'
import { VRMRenderer } from './VRMRenderer'

export class AnimationManager {
  private renderer: VRMRenderer
  private clipCache: Map<string, THREE.AnimationClip> = new Map()
  private idleAction: THREE.AnimationAction | null = null

  constructor(renderer: VRMRenderer) {
    this.renderer = renderer
  }

  async ensureIdle(): Promise<void> {
    const mixer = this.renderer.getMixer()
    const vrm = this.renderer.getVRM()
    if (!mixer || !vrm) return
    const idlePath = '/assets/animations/standard_idle.vrma'

    try {
      const idleClip = await this.getOrLoadClip(idlePath)
      if (idleClip) {
        const action = mixer.clipAction(idleClip)
        action.setLoop(THREE.LoopRepeat, Infinity)
        action.fadeIn(0.3).play()
        this.idleAction = action
        return
      }
    } catch (e) {
      console.warn('[AvatarSpeaker] Idle animation not available')
    }
  }

  async playAnimation(path: string): Promise<void> {
    const mixer = this.renderer.getMixer()
    const vrm = this.renderer.getVRM()
    if (!mixer || !vrm) {
      console.warn('[AvatarSpeaker] Animation not available')
      return
    }

    try {
      const clip = await this.getOrLoadClip(path)
      if (!clip) {
        console.warn(`[AvatarSpeaker] Animation not found: ${path}`)
        return
      }

      const action = mixer.clipAction(clip)
      action.reset()
      action.setLoop(THREE.LoopOnce, 0)
      action.clampWhenFinished = true
      action.enabled = true
      action.play()
      if (this.idleAction && this.idleAction !== action) {
        action.crossFadeFrom(this.idleAction, 0.3, false)
      } else {
        action.fadeIn(0.3)
      }

      await new Promise<void>((resolve) => {
        const handleFinished = (e: any) => {
          if (e?.action === action) {
            mixer.removeEventListener('finished', handleFinished)
            if (this.idleAction && this.idleAction !== action) {
              this.idleAction.enabled = true
              this.idleAction.setLoop(THREE.LoopRepeat, Infinity)
              this.idleAction.play()
              this.idleAction.crossFadeFrom(action, 0.3, false)
            }
            resolve()
          }
        }
        mixer.addEventListener('finished', handleFinished)
      })
    } catch (error) {
      console.warn(`[AvatarSpeaker] Animation playback failed: ${path}`, error)
    }
  }

  private async getOrLoadClip(path: string): Promise<THREE.AnimationClip | null> {
    const cached = this.clipCache.get(path)
    if (cached) return cached

    try {
      const loader = new GLTFLoader()
      loader.crossOrigin = 'anonymous'
      loader.register((parser) => new VRMAnimationLoaderPlugin(parser))

      const gltf = await loader.loadAsync(path)
      const vrmAnimation = (gltf as any)?.userData?.vrmAnimations?.[0]
      if (!vrmAnimation) return null

      const vrm = this.renderer.getVRM()
      if (!vrm) return null

      const clip = createVRMAnimationClip(vrmAnimation, vrm) as unknown as THREE.AnimationClip
      this.clipCache.set(path, clip)
      return clip
    } catch (error) {
      console.warn(`[AvatarSpeaker] Failed to load animation: ${path}`, error)
      return null
    }
  }

  destroy(): void {
    this.clipCache.clear()
    this.idleAction = null
  }
}

