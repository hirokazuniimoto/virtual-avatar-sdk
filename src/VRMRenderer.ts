/**
 * VRMRenderer - VRM model loading and rendering
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRMUtils, VRM } from '@pixiv/three-vrm'
import { EventEmitter } from './EventEmitter'

export class VRMRenderer extends EventEmitter {
  private canvas: HTMLCanvasElement
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private vrm: VRM | null = null
  private mixer: THREE.AnimationMixer | null = null
  private clock: THREE.Clock
  private animationId: number | null = null
  private avatarPath: string

  constructor(avatarPath: string, canvas?: HTMLCanvasElement | HTMLElement) {
    super()
    this.avatarPath = avatarPath

    // キャンバスの準備
    if (canvas) {
      // HTMLCanvasElement が渡された場合
      if (canvas instanceof HTMLCanvasElement) {
        this.canvas = canvas
      } else {
        // HTMLElement（divなど）が渡された場合、canvas要素を作成して追加
        this.canvas = document.createElement('canvas')
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        canvas.appendChild(this.canvas)
      }
    } else {
      // 何も渡されなかった場合、bodyに追加
      this.canvas = document.createElement('canvas')
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      document.body.appendChild(this.canvas)
    }

    // シーンの初期化
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.05, 50.0)
    this.camera.position.set(0.0, 1.4, 2.0)

    // レンダラーの初期化
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    })
    this.resize()

    // ライティング
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
    directionalLight.position.set(1.2, 2.5, 1.8)
    this.scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6)
    fillLight.position.set(-1, 1.2, 1.2)
    this.scene.add(fillLight)

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.0)
    this.scene.add(ambientLight)

    // アニメーションループ
    this.clock = new THREE.Clock()
    this.animate()

    // リサイズハンドラ
    window.addEventListener('resize', () => this.resize())
  }

  private resize() {
    const { clientWidth, clientHeight } = this.canvas
    this.renderer.setSize(clientWidth, clientHeight, false)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate)
    const deltaTime = Math.min(this.clock.getDelta(), 0.1)

    if (this.mixer) {
      this.mixer.update(deltaTime)
    }

    if (this.vrm) {
      this.vrm.update(deltaTime)
    }

    this.renderer.render(this.scene, this.camera)
  }

  async load(): Promise<void> {
    await this.loadVRM(this.avatarPath)
  }

  async loadVRM(path: string): Promise<void> {
    try {
      const loader = new GLTFLoader()
      loader.crossOrigin = 'anonymous'
      loader.register((parser) => new VRMLoaderPlugin(parser))

      const gltf = await loader.loadAsync(path)
      const vrm = (gltf as any).userData.vrm as VRM

      if (!vrm) {
        throw new Error('VRM data not found in GLTF')
      }

      // 最適化
      VRMUtils.removeUnnecessaryVertices(vrm.scene)
      VRMUtils.removeUnnecessaryJoints(vrm.scene)
      vrm.scene.traverse((obj) => {
        obj.frustumCulled = false
      })

      // 既存のVRMを削除
      if (this.vrm) {
        this.scene.remove(this.vrm.scene)
      }

      // 新しいVRMを追加
      vrm.scene.rotation.y = Math.PI
      vrm.scene.scale.set(1.4, 1.4, 1.4)
      vrm.scene.position.set(-0.05, -0.5, 0)

      this.scene.add(vrm.scene)
      this.vrm = vrm

      // アニメーションミキサーの初期化
      this.mixer = new THREE.AnimationMixer(vrm.scene)

      // T字ポーズ防止（idleアニメーションがない場合）
      if (!this.mixer) {
        this.applyNeutralPose(vrm)
      }
    } catch (error) {
      this.emit('error', error instanceof Error ? error : new Error(String(error)))
      throw error
    }
  }

  private applyNeutralPose(vrm: VRM) {
    try {
      const h: any = (vrm as any).humanoid
      const setRotZ = (bone: string, z: number) => {
        const n = h?.getBoneNode?.(bone)
        if (n) n.rotation.z = z
      }
      const setRotX = (bone: string, x: number) => {
        const n = h?.getBoneNode?.(bone)
        if (n) n.rotation.x = x
      }

      setRotZ('leftUpperArm', -0.6)
      setRotZ('rightUpperArm', 0.6)
      setRotZ('leftLowerArm', -0.15)
      setRotZ('rightLowerArm', 0.15)
      setRotX('leftLowerLeg', 0.06)
      setRotX('rightLowerLeg', 0.06)
      setRotX('neck', -0.05)
    } catch (e) {
      // 無視
    }
  }

  getVRM(): VRM | null {
    return this.vrm
  }

  getMixer(): THREE.AnimationMixer | null {
    return this.mixer
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    if (this.renderer) {
      this.renderer.dispose()
    }
    if (this.vrm) {
      this.scene.remove(this.vrm.scene)
    }
    window.removeEventListener('resize', () => this.resize())
  }
}

