class VisibilityChangeObserver {
  private started: boolean = false;
  private observers: (() => void)[] = [];

  private broadcast = () => {
    this.observers.forEach(fn => fn());
    this.observers = [];
  };

  start() {
    if (this.started) {
      return;
    }

    this.started = true;

    document.addEventListener('visibilitychange', this.broadcast);
    /**
     * According to https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
     * Safari doesn’t fire visibilitychange as expected when the value of the visibilityState property transitions to hidden;
     * so for that case, you need to also include code to listen for the pagehide event.
     */
    window.addEventListener('pagehide', this.broadcast);
  }

  subscribe(callback: () => void) {
    this.observers.push(callback);
  }

  unsubscribe(callback: () => void) {
    this.observers = this.observers.filter(fn => fn !== callback);
  }
}

export const visibilityChangeObserver = new VisibilityChangeObserver();
