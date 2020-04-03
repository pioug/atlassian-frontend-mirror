import { CustomMediaPicker } from '@atlaskit/editor-core';

export default class MobileMediaPicker implements CustomMediaPicker {
  private listeners: any = {};

  on(event: string, cb: any): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(cb);
  }

  removeAllListeners(event: any) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = [];
  }

  emit(event: string, data: any): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach((cb: any) => cb(data));
  }

  destroy(): void {
    this.listeners = {};
  }

  setUploadParams(_uploadParams: any) {}
}
