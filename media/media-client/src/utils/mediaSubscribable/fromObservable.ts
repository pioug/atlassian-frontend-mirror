import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MediaSubscribableItem } from '../../models/media-subscribable';
import { createMediaSubject } from '../createMediaSubject';
import { MediaSubscribable, MediaSubscription } from './types';

export function fromObservable<T>(
  observable: ReplaySubject<T>,
): MediaSubscribable<T> {
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

export function createMediaSubscribable<T extends MediaSubscribableItem>(
  mediaSubscribableItem?: T | Error,
): MediaSubscribable<T> {
  return fromObservable(createMediaSubject(mediaSubscribableItem));
}
