import { Subscription } from 'rxjs/Subscription';
import { MediaSubscribable } from './types';
import { FileState } from '@atlaskit/media-state';
/**
 * This is a helper to transform the first value emitted by an MediaSubscribable into a Promise.
 *
 * @param mediaSubscribable a given MediaSubscribable<MediaSubscribableItem>
 * @param subscription a default Subscription (this parameter exists for testing purpose)
 */

export const toPromise = (
  mediaSubscribable: MediaSubscribable,
  subscription = new Subscription(),
): Promise<FileState> =>
  new Promise((resolve, reject) =>
    subscription.add(
      mediaSubscribable.subscribe({
        next: (state) => {
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
