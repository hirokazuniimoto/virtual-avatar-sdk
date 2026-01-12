/**
 * SubtitleRenderer - subtitle display
 */

export class SubtitleRenderer {
  private container: HTMLElement
  private subtitleElement: HTMLElement | null = null
  private autoHideTimer: number | null = null

  constructor(container?: HTMLElement) {
    if (container) {
      this.container = container
    } else {
      this.container = document.createElement('div')
      this.container.style.position = 'fixed'
      this.container.style.bottom = '20px'
      this.container.style.left = '50%'
      this.container.style.transform = 'translateX(-50%)'
      this.container.style.zIndex = '1000'
      this.container.style.pointerEvents = 'none'
      document.body.appendChild(this.container)
    }
  }

  show(text: string): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer)
      this.autoHideTimer = null
    }

    if (!this.subtitleElement) {
      this.subtitleElement = document.createElement('div')
      this.subtitleElement.style.background = 'rgba(0, 0, 0, 0.7)'
      this.subtitleElement.style.color = 'white'
      this.subtitleElement.style.padding = '12px 24px'
      this.subtitleElement.style.borderRadius = '8px'
      this.subtitleElement.style.fontSize = '18px'
      this.subtitleElement.style.maxWidth = '80%'
      this.subtitleElement.style.textAlign = 'center'
      this.subtitleElement.style.wordWrap = 'break-word'
      this.container.appendChild(this.subtitleElement)
    }

    this.subtitleElement.textContent = text
    this.subtitleElement.style.display = 'block'
  }

  hide(): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer)
      this.autoHideTimer = null
    }

    this.autoHideTimer = window.setTimeout(() => {
      if (this.subtitleElement) {
        this.subtitleElement.style.display = 'none'
      }
      this.autoHideTimer = null
    }, 5000)
  }

  destroy(): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer)
    }
    if (this.subtitleElement) {
      this.subtitleElement.remove()
    }
    if (this.container.parentElement && this.container === document.body.lastElementChild) {
      this.container.remove()
    }
  }
}

