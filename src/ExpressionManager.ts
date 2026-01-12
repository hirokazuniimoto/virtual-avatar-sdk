/**
 * ExpressionManager - expression control
 */

import { VRMExpressionPresetName } from '@pixiv/three-vrm'
import { VRMRenderer } from './VRMRenderer'
import type { ExpressionType } from './types'

export class ExpressionManager {
  private renderer: VRMRenderer

  constructor(renderer: VRMRenderer) {
    this.renderer = renderer
  }

  initialize(): void {
    this.setNeutral()
  }

  setExpression(expression: VRMExpressionPresetName, weight: number): void {
    const vrm = this.renderer.getVRM()
    if (vrm?.expressionManager) {
      vrm.expressionManager.setValue(expression, weight)
    } else {
      console.warn('[AvatarSpeaker] Expression not available')
    }
  }

  setJoy(weight: number): void {
    this.setExpression(VRMExpressionPresetName.Happy, weight)
  }

  setAngry(weight: number): void {
    this.setExpression(VRMExpressionPresetName.Angry, weight)
  }

  setSorrow(weight: number): void {
    this.setExpression(VRMExpressionPresetName.Sad, weight)
  }

  setFun(weight: number): void {
    this.setExpression(VRMExpressionPresetName.Happy, weight * 0.5)
  }

  setNeutral(): void {
    const vrm = this.renderer.getVRM()
    if (vrm?.expressionManager) {
      const expressionManager = vrm.expressionManager
      const presets = [
        VRMExpressionPresetName.Happy,
        VRMExpressionPresetName.Angry,
        VRMExpressionPresetName.Sad,
      ]
      presets.forEach((preset) => {
        expressionManager.setValue(preset, 0)
      })
    }
  }

  setExpressionType(type: ExpressionType): void {
    switch (type) {
      case 'joy':
        this.setJoy(1)
        break
      case 'fun':
        this.setFun(1)
        break
      case 'neutral':
      default:
        this.setNeutral()
        break
    }
  }
}

