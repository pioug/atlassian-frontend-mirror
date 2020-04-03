export type SubscriberCallback = (node: any) => void;

class ADFTraversor {
  private doc: any;
  private subscribers = new Map<string, SubscriberCallback[]>();

  constructor(doc: any) {
    this.doc = doc;
  }

  public subscribe(type: string, callback: SubscriberCallback) {
    const callbacks = this.subscribers.get(type);
    if (!callbacks) {
      this.subscribers.set(type, [callback]);
    } else {
      callbacks.push(callback);
    }
  }

  public exec() {
    if (!this.doc || !Array.isArray(this.doc.content)) {
      return;
    }

    let candidates = this.doc.content.slice(0);
    while (candidates.length) {
      const node = candidates.shift();
      if (Array.isArray(node.content)) {
        candidates = candidates.concat(node.content);
      }
      const callbacks = this.subscribers.get(node.type);
      if (!callbacks) {
        continue;
      }

      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](node);
      }
    }
  }
}

export default ADFTraversor;
