export class Signal<SignalData> {
  private handler: ((data: SignalData) => void) | null = null;

  // Call this method to emit event
  emit(data: SignalData) {
    if (this.handler) {
      this.handler(data);
    }
  }

  // The following methods are used by the engine. Do not call them
  listen(handler: (data: SignalData) => void) {
    this.handler = handler;
  }

  reset(): void {
    this.handler = null;
  }
}
