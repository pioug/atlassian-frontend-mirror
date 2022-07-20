import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { ChunkinatorFile } from './domain';

export async function fetchBlob(file: ChunkinatorFile): Promise<Blob> {
  if (typeof file === 'string') {
    return await fetch(file).then((response) => response.blob());
  } else {
    return file;
  }
}
interface Notifier {
  notifyIfReady(): boolean;
}

const notify = <T>(
  promise: PromiseLike<T>,
  observer: Observer<T>,
  onReady: (notifier: Notifier) => void,
): Notifier => {
  const notifier = {
    notifyIfReady: () => false,
  };

  promise.then(
    (value) => {
      notifier.notifyIfReady = () => {
        observer.next(value);
        observer.complete();
        return true;
      };

      onReady(notifier);
    },
    (reason) => {
      notifier.notifyIfReady = () => {
        observer.error(reason);
        return true;
      };
      onReady(notifier);
    },
  );

  return notifier;
};

const mapper = <T, U>(project: (value: T) => PromiseLike<U>) => {
  const notifiers = new Array<Notifier>();

  const onReady = () => {
    // find the first non-ready notifier in the queue,
    // while invoking all ready notifiers that we encounter along the way
    const notReadyIdx = notifiers.findIndex(
      (notifier) => !notifier.notifyIfReady(),
    );
    if (notReadyIdx > 0) {
      // remove all the notifiers we invoked
      notifiers.splice(0, notReadyIdx);
    }
  };

  return (value: T) =>
    new Observable<U>((sub) => {
      notifiers.push(notify(project(value), sub, onReady));
    });
};

export const asyncMap = <T, U>(
  project: (item: T) => PromiseLike<U>,
  concurrent: number,
): ((source$: Observable<T>) => Observable<U>) =>
  mergeMap(mapper(project), concurrent);
