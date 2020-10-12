import { OnProviderChange, Provider } from './types';

export abstract class AbstractResource<Q, R, E, I, O>
  implements Provider<Q, R, E, I, O> {
  private lastResult: R | undefined;
  private listeners = new Set<OnProviderChange<R, E, I>>();

  abstract filter(query?: Q, options?: O): void;

  subscribe(onChange: OnProviderChange<R, E, I>): void {
    this.listeners.add(onChange);
    if (this.lastResult) {
      // Notify subscribe of last result (i.e. initial state)
      onChange.result(this.lastResult);
    }
  }

  unsubscribe(onChange: OnProviderChange<R, E, I>): void {
    this.listeners.delete(onChange);
  }

  protected notifyResult(result: R): void {
    this.listeners.forEach(onChange => {
      onChange.result(result);
    });
  }

  protected notifyError(error: E): void {
    this.listeners.forEach(onChange => {
      if (onChange.error) {
        onChange.error(error);
      }
    });
  }

  protected notifyInfo(info: I): void {
    this.listeners.forEach(onChange => {
      if (onChange.info) {
        onChange.info(info);
      }
    });
  }

  protected notifyNotReady(): void {
    this.listeners.forEach(onChange => {
      if (onChange.notReady) {
        onChange.notReady();
      }
    });
  }
}
