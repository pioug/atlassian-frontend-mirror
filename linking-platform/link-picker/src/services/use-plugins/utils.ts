import {
  LinkPickerPlugin,
  LinkPickerState,
  ResolveResult,
} from '../../common/types';

export class CancellationError extends Error {}

export const cancellable = <T extends unknown>(
  promise: Promise<T>,
): { promise: Promise<T>; cancel: () => void } => {
  let reject: (err: unknown) => void;

  return {
    promise: new Promise<T>((resolve, _reject) => {
      reject = _reject;
      promise.then(resolve, reject);
    }),
    cancel: () => {
      reject(new CancellationError('Promise cancelled'));
    },
  };
};

/**
 * Wraps the resolve with a cancellation wrapper and makes promise + generator plugin resolves more compatible
 * Calling cancel for generator plugin prevents it from yielding any further updates
 */
export const resolvePluginUpdates = (
  plugin: LinkPickerPlugin,
  state: LinkPickerState,
): {
  cancel: () => void;
  next: () => Promise<{ done?: boolean; value: ResolveResult }>;
} => {
  const updates = plugin.resolve(state);

  // Promise plugin
  if (updates instanceof Promise) {
    const { promise, cancel } = cancellable(updates);
    return {
      cancel,
      next: async () => ({
        value: await promise,
        done: true,
      }),
    };
  }

  // Generator plugin
  const cancellationCallbacks: (() => void)[] = [];
  let cancelled = false;
  return {
    cancel: () => {
      cancelled = true;
      cancellationCallbacks.forEach(cb => cb());
    },
    next: () => {
      const { promise, cancel } = cancellable(updates.next());
      if (cancelled) {
        cancel();
      } else {
        cancellationCallbacks.push(cancel);
      }
      return promise;
    },
  };
};
