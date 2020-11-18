import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/**
 * We're using this custom helper in place of ".toPromise()" to transform the first value emitted by an Observable or Subject into a Promise.
 * Note that in RxJS 7 ".toPromise()" is deprecated and replaced by "firstValueFrom()/.lastValueFrom()"
 *
 * @param observable a given Observable<T> or Subject<T>
 * @param subscription a default Subscription (this parameter exists for testing purpose)
 */

export const observableToPromise = <T>(
  observable: Observable<T>,
  subscription = new Subscription(),
): Promise<T> => {
  return new Promise<T>((resolve, reject) =>
    subscription.add(
      observable.subscribe({
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
