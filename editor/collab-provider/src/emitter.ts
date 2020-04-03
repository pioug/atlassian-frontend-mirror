import { EventEmitter2 } from 'eventemitter2';

export class Emitter<T = any> {
  private eventEmitter: EventEmitter2 = new EventEmitter2();

  /**
   * Emit events to subscribers
   */
  protected emit<K extends keyof T>(evt: K, data: T[K]) {
    this.eventEmitter.emit(evt as any, data);
    return this;
  }

  /**
   * Subscribe to events emitted by this provider
   */
  on<K extends keyof T>(evt: K, handler: (args: T[K]) => void) {
    this.eventEmitter.on(evt as any, handler);
    return this;
  }

  /**
   * Unsubscribe from events emitted by this provider
   */
  off<K extends keyof T>(evt: K, handler: (args: T[K]) => void) {
    this.eventEmitter.off(evt as any, handler);
    return this;
  }

  /**
   * Unsubscribe from all events emitted by this provider.
   */
  unsubscribeAll<K extends keyof T>(evt?: K) {
    this.eventEmitter.removeAllListeners(evt as any);
    return this;
  }
}
