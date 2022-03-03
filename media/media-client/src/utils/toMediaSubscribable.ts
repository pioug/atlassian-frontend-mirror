import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MediaSubscribableItem } from './../models/media-subscribable';

export type MediaSubscription = {
  unsubscribe: () => void;
};

type PartialObserver<T extends MediaSubscribableItem> = {
  next?: (value: T) => void;
  error?: (err: any) => void;
};

// Each of these makes one of the PartialObserver attrs required:
type NextObserver<T extends MediaSubscribableItem> = PartialObserver<T> &
  Required<Pick<PartialObserver<T>, 'next'>>;
type ErrorObserver<T extends MediaSubscribableItem> = PartialObserver<T> &
  Required<Pick<PartialObserver<T>, 'error'>>;

export type MediaObserver<T extends MediaSubscribableItem> =
  | NextObserver<T>
  | ErrorObserver<T>
  | ((value: T) => void);

export type MediaSubscribable<T extends MediaSubscribableItem> = {
  subscribe(observer?: MediaObserver<T>): MediaSubscription;
};

export function toMediaSubscribable<T extends MediaSubscribableItem>(
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
