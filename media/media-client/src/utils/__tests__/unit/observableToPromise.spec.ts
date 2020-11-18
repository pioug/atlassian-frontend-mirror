import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { from } from 'rxjs/observable/from';

import { observableToPromise } from '../../observableToPromise';

describe('observableToPromise()', () => {
  describe('With Observable', () => {
    it('should resolve first emitted value when no error', async () => {
      const o$ = from([1, 2, 3]);
      expect(await observableToPromise(o$)).toEqual(1);
    });

    it('should resolve first emitted value when error', async () => {
      const error = new Error('an error');
      const o$ = Observable.create((observer: Observer<number>) => {
        observer.next(1);
        observer.next(2);
        observer.error(error);
      });
      expect(await observableToPromise(o$)).toEqual(1);
    });

    it('should reject error if first emitted', async () => {
      const error = new Error('an error');
      const o$ = Observable.create((observer: Observer<number>) =>
        observer.error(error),
      );

      try {
        await observableToPromise(o$);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should unsubscribe after resolving', async () => {
      const testSubscription = new Subscription();
      const o$ = from([1, 2, 3]);

      await observableToPromise(o$, testSubscription);
      expect(testSubscription.closed).toBeTruthy();
    });

    it('should unsubscribe after rejecting', async () => {
      const testSubscription = new Subscription();
      const o$ = Observable.create((observer: Observer<number>) =>
        observer.error(new Error('an error')),
      );

      try {
        await observableToPromise(o$, testSubscription);
      } catch (err) {
        expect(testSubscription.closed).toBeTruthy();
      }

      expect.assertions(1);
    });
  });

  describe('With ReplaySubject', () => {
    it('should resolve current value regardless of being complete', async () => {
      const s$ = new ReplaySubject(1);

      s$.next(1);
      expect(await observableToPromise(s$)).toEqual(1);

      s$.next(2);
      expect(await observableToPromise(s$)).toEqual(2);
    });

    it('should resolve last good value if error emitted', async () => {
      const s$ = new ReplaySubject(1);

      s$.next(1);
      expect(await observableToPromise(s$)).toEqual(1);

      s$.error(new Error('an error'));
      expect(await observableToPromise(s$)).toEqual(1);
    });

    it('should reject error if first emitted', async () => {
      const error = new Error('an error');
      const s$ = new ReplaySubject(1);

      s$.error(error);
      try {
        await observableToPromise(s$);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should unsubscribe after resolving', async () => {
      const testSubscription = new Subscription();
      const s$ = new ReplaySubject(1);

      s$.next(1);
      await observableToPromise(s$, testSubscription);
      expect(testSubscription.closed).toBeTruthy();
    });

    it('should unsubscribe after rejecting', async () => {
      const testSubscription = new Subscription();
      const s$ = new ReplaySubject(1);

      try {
        s$.error(new Error('an error'));
        await observableToPromise(s$, testSubscription);
      } catch (err) {
        expect(testSubscription.closed).toBeTruthy();
      }

      expect.assertions(1);
    });
  });
});
