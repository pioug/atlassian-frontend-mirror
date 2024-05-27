import { type FileState } from '@atlaskit/media-state';
import { Observable } from 'rxjs/Observable';
import { type Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { from } from 'rxjs/observable/from';
import { toPromise } from '../../toPromise';

const fS1: FileState = {
  id: '1',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};
const fS2: FileState = {
  id: '2',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};
const fS3: FileState = {
  id: '3',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};

describe('toPromise()', () => {
  describe('With Observable', () => {
    it('should resolve first emitted value when no error', async () => {
      const o$ = from<FileState>([fS1, fS2, fS3]);
      expect(await toPromise(o$)).toEqual(fS1);
    });

    it('should resolve first emitted value when error', async () => {
      const error = new Error('an error');
      const o$ = Observable.create((observer: Observer<number>) => {
        observer.next(1);
        observer.next(2);
        observer.error(error);
      });
      expect(await toPromise(o$)).toEqual(1);
    });

    it('should reject error if first emitted', async () => {
      const error = new Error('an error');
      const o$ = Observable.create((observer: Observer<number>) =>
        observer.error(error),
      );

      try {
        await toPromise(o$);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should unsubscribe after resolving', async () => {
      const testSubscription = new Subscription();
      const o$ = from<FileState>([fS1, fS2, fS3]);

      await toPromise(o$, testSubscription);
      expect(testSubscription.closed).toBeTruthy();
    });

    it('should unsubscribe after rejecting', async () => {
      const testSubscription = new Subscription();
      const o$ = Observable.create((observer: Observer<number>) =>
        observer.error(new Error('an error')),
      );

      try {
        await toPromise(o$, testSubscription);
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
      expect(await toPromise(s$)).toEqual(1);

      s$.next(2);
      expect(await toPromise(s$)).toEqual(2);
    });

    it('should resolve last good value if error emitted', async () => {
      const s$ = new ReplaySubject(1);

      s$.next(1);
      expect(await toPromise(s$)).toEqual(1);

      s$.error(new Error('an error'));
      expect(await toPromise(s$)).toEqual(1);
    });

    it('should reject error if first emitted', async () => {
      const error = new Error('an error');
      const s$ = new ReplaySubject(1);

      s$.error(error);
      try {
        await toPromise(s$);
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect.assertions(1);
    });

    it('should unsubscribe after resolving', async () => {
      const testSubscription = new Subscription();
      const s$ = new ReplaySubject(1);

      s$.next(1);
      await toPromise(s$, testSubscription);
      expect(testSubscription.closed).toBeTruthy();
    });

    it('should unsubscribe after rejecting', async () => {
      const testSubscription = new Subscription();
      const s$ = new ReplaySubject(1);

      try {
        s$.error(new Error('an error'));
        await toPromise(s$, testSubscription);
      } catch (err) {
        expect(testSubscription.closed).toBeTruthy();
      }

      expect.assertions(1);
    });
  });
});
