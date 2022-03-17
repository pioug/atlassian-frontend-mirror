import { Subscription } from 'rxjs/Subscription';
import { MediaSubscribable } from './toMediaSubscribable';
import { MediaSubscribableItem } from '../models/media-subscribable';
/**
 * This is a helper to transform the first value emitted by an MediaSubscribable into a Promise.
 *
 * @param mediaSubscribable a given MediaSubscribable<MediaSubscribableItem>
 * @param subscription a default Subscription (this parameter exists for testing purpose)
 */

export const mediaSubscribableToPromise = <T extends MediaSubscribableItem>(
  mediaSubscribable: MediaSubscribable<T>,
  subscription = new Subscription(),
): Promise<T> => {
  return new Promise<T>((resolve, reject) =>
    subscription.add(
      mediaSubscribable.subscribe({
        next: (state: T) => {
          resolve(state);
          subscription.unsubscribe();
        },
        error: (error: any) => {
          reject(error);
          subscription.unsubscribe();
        },
      }),
    ),
  );
};
