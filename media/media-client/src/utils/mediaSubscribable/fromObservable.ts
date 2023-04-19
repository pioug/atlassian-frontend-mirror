import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FileState } from '../../models/file-state';
import { createMediaSubject } from '../createMediaSubject';
import { MediaSubscribable, MediaSubscription } from './types';

export function fromObservable(
  observable: ReplaySubject<FileState>,
): MediaSubscribable {
  return {
    subscribe: (observer): MediaSubscription => {
      const subscription =
        // This is needed to handle "subscribe" function overload.
        // It allows accepting a single "next" callback function as an argument.
        observer instanceof Function
          ? observable.subscribe(observer)
          : observable.subscribe(observer);

      return {
        unsubscribe: () => {
          subscription.unsubscribe();
        },
      };
    },
  };
}

export function createMediaSubscribable(
  item?: FileState | Error,
): MediaSubscribable {
  return fromObservable(createMediaSubject(item));
}
