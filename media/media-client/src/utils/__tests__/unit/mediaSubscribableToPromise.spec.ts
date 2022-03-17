import { MediaSubscribableItem } from '../../../models/media-subscribable';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { from } from 'rxjs/observable/from';

import { mediaSubscribableToPromise } from '../../mediaSubscribableToPromise';
const fS1: MediaSubscribableItem = {
  id: '1',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};
const fS2: MediaSubscribableItem = {
  id: '2',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};
const fS3: MediaSubscribableItem = {
  id: '3',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};

describe('mediaSubscribableToPromise()', () => {
  describe('With Observable', () => {
    it('should resolve first emitted value when no error', async () => {
      const o$ = from([fS1, fS2, fS3]);
      expect(await mediaSubscribableToPromise(o$)).toEqual(fS1);
    });

    it('should resolve first emitted value when error', async () => {
      const error = new Error('an error');
      const o$ = Observable.create((observer: Observer<number>) => {
        observer.next(1);
        observer.next(2);
        observer.error(error);
      });
      expect(await mediaSubscribableToPromise(o$)).toEqual(1);
    });

    it('should reject error if first emitted', async () => {
      const error = new Error('an error');
      const o$ = Observable.create((observer: Observer<number>) =>
        observer.error(error),
      );

      try {
        await mediaSubscribableToPromise(o$);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should unsubscribe after resolving', async () => {
      const testSubscription = new Subscription();
      const o$ = from([fS1, fS2, fS3]);

      await mediaSubscribableToPromise(o$, testSubscription);
      expect(testSubscription.closed).toBeTruthy();
    });

    it('should unsubscribe after rejecting', async () => {
      const testSubscription = new Subscription();
      const o$ = Observable.create((observer: Observer<number>) =>
        observer.error(new Error('an error')),
      );

      try {
        await mediaSubscribableToPromise(o$, testSubscription);
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
      expect(await mediaSubscribableToPromise(s$)).toEqual(1);

      s$.next(2);
      expect(await mediaSubscribableToPromise(s$)).toEqual(2);
    });

    it('should resolve last good value if error emitted', async () => {
      const s$ = new ReplaySubject(1);

      s$.next(1);
      expect(await mediaSubscribableToPromise(s$)).toEqual(1);

      s$.error(new Error('an error'));
      expect(await mediaSubscribableToPromise(s$)).toEqual(1);
    });

    it('should reject error if first emitted', async () => {
      const error = new Error('an error');
      const s$ = new ReplaySubject(1);

      s$.error(error);
      try {
        await mediaSubscribableToPromise(s$);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should unsubscribe after resolving', async () => {
      const testSubscription = new Subscription();
      const s$ = new ReplaySubject(1);

      s$.next(1);
      await mediaSubscribableToPromise(s$, testSubscription);
      expect(testSubscription.closed).toBeTruthy();
    });

    it('should unsubscribe after rejecting', async () => {
      const testSubscription = new Subscription();
      const s$ = new ReplaySubject(1);

      try {
        s$.error(new Error('an error'));
        await mediaSubscribableToPromise(s$, testSubscription);
      } catch (err) {
        expect(testSubscription.closed).toBeTruthy();
      }

      expect.assertions(1);
    });
  });
});
