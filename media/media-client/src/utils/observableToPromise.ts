import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// We can't use observable.toPromise() because it only resolves when the observable completes, which never happens with ReplaySubject
export const observableToPromise = <T>(observable: Observable<T>): Promise<T> =>
  new Promise<T>(resolve =>
    observable.subscribe({
      next(this: Subscriber<T>, state) {
        resolve(state);
        this.unsubscribe();
      },
    }),
  );
