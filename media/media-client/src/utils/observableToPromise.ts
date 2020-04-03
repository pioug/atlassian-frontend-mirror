import { Observable } from 'rxjs/Observable';
import { safeUnsubscribe } from './safeUnsubscribe';

// We can't use observable.toPromise() because it only resolves when the observable completes, which never happens with ReplaySubject
export const observableToPromise = <T>(
  observable: Observable<T>,
): Promise<T> => {
  return new Promise<T>(resolve => {
    const subscription = observable.subscribe({
      next: state => {
        resolve(state);
        safeUnsubscribe(subscription);
      },
    });
  });
};
