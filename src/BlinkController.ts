/**
 * BlinkController - 常時瞬き制御
 */

import { VRMExpressionPresetName } from '@pixiv/three-vrm'
import { VRMRenderer } from './VRMRenderer'

export class BlinkController {
  private renderer: VRMRenderer
  private isActive: boolean = false
  private lastBlinkTime: number = 0
  private blinkInterval: number = 3000 // 3秒間隔
  private animationId: number | null = null
  private time: number = 0

  constructor(renderer: VRMRenderer) {
    this.renderer = renderer
  }

  start(): void {
    if (this.isActive) return
    this.isActive = true
    this.lastBlinkTime = 0
    this.time = 0
    this.update()
  }

  stop(): void {
    this.isActive = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private update = () => {
    if (!this.isActive) return

    const vrm = this.renderer.getVRM()
    if (!vrm?.expressionManager) {
      this.animationId = requestAnimationFrame(this.update)
      return
    }

    // 現在の表情の重みをチェック（表情が設定されている時は無効）
    const currentHappyWeight = vrm.expressionManager.getValue(VRMExpressionPresetName.Happy) || 0
    const currentAngryWeight = vrm.expressionManager.getValue(VRMExpressionPresetName.Angry) || 0
    const currentSadWeight = vrm.expressionManager.getValue(VRMExpressionPresetName.Sad) || 0

    // 表情が設定されていない時のみまばたき
    if (currentHappyWeight === 0 && currentAngryWeight === 0 && currentSadWeight === 0) {
      const currentTime = this.time * 1000
      if (currentTime - this.lastBlinkTime > this.blinkInterval) {
        this.blink()
        this.lastBlinkTime = currentTime
        // 次のまばたきまでの間隔をランダムに設定（2-5秒）
        this.blinkInterval = 2000 + Math.random() * 3000
      }
    }

    this.time += 0.016 // 約60fps
    this.animationId = requestAnimationFrame(this.update)
  }

  private blink(): void {
    const vrm = this.renderer.getVRM()
    if (!vrm?.expressionManager) return

    const blinkDuration = 150 // 0.15秒
    const blinkWeight = 1.0

    vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, blinkWeight)

    setTimeout(() => {
      if (vrm?.expressionManager) {
        vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0)
      }
    }, blinkDuration)
  }
}

