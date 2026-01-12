/**
 * LipSync - リップシンク（口パク）制御
 * VRMAvatar.tsx を参考にしたシンプルなsin波ベースの口パクアニメーション
 */

import * as THREE from 'three'
import { VRMExpressionPresetName } from '@pixiv/three-vrm'
import { VRMRenderer } from './VRMRenderer'

export class LipSync {
  private renderer: VRMRenderer
  private isActive: boolean = false
  private time: number = 0
  private animationId: number | null = null
  private clock: THREE.Clock

  constructor(renderer: VRMRenderer) {
    this.renderer = renderer
    this.clock = new THREE.Clock()
  }

  start(): void {
    if (this.isActive) return
    this.isActive = true
    this.time = 0
    this.clock.start()
    this.update()
  }

  stop(): void {
    this.isActive = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.clock.stop()
    // 口形をリセット
    const vrm = this.renderer.getVRM()
    if (vrm?.expressionManager) {
      vrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 0)
    }
  }

  private update = () => {
    if (!this.isActive) return

    const vrm = this.renderer.getVRM()
    if (vrm?.expressionManager) {
      // VRMAvatar.tsx を参考にした実装
      // 時間を累積（deltaTime を考慮した正確な時間管理）
      const deltaTime = Math.min(this.clock.getDelta(), 0.1)
      this.time += deltaTime
      
      // シンプルなsin波ベースの口パク（1秒に約2-3回の周期、自然な速度）
      // VRMAvatar.tsx では * 10 を使っているが、これは速すぎるので * 2.5 に調整
      const weight = (Math.sin(this.time * 10) + 1) / 2
      vrm.expressionManager.setValue(VRMExpressionPresetName.Aa, weight)
    }

    this.animationId = requestAnimationFrame(this.update)
  }
}

