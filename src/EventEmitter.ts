/**
 * EventEmitter - simple event emitter 
 * used to display loading status or error messages etc.
 */

export class EventEmitter {
  private listeners: Map<string, Set<Function>> = new Map()

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  off(event: string, listener: Function): void {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  emit(event: string, ...args: any[]): void {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }
}

