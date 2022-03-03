import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { toMediaSubscribable } from '../../toMediaSubscribable';
import { MediaSubscribableItem } from './../../../models/media-subscribable';

describe('toMediaSubscribable', () => {
  const observable = new ReplaySubject<MediaSubscribableItem>(1);
  const mediaSubscribable = toMediaSubscribable(observable);
  const nextObserver = {
    next: () => {},
  };

  const errorObserver = {
    error: () => {},
  };

  const fullMediaObserver = {
    ...nextObserver,
    ...errorObserver,
  };

  const nextCallback = () => {};

  it('should convert observable to Media Subscribable exposing subscribe method only', () => {
    const expectedMediaSubscribableShape = { subscribe: expect.any(Function) };
    expect(mediaSubscribable).toMatchObject(expectedMediaSubscribableShape);
  });

  describe('subscribe', () => {
    let observableSubscribeSpy = jest.spyOn(observable, 'subscribe');

    afterAll(() => {
      observableSubscribeSpy.mockRestore();
    });

    it.each([nextObserver, errorObserver, fullMediaObserver, nextCallback])(
      'calling media subscribable subscribe should call observable subscribe with the passed observer',
      (observer) => {
        mediaSubscribable.subscribe(observer);
        expect(observableSubscribeSpy).toHaveBeenCalledWith(observer);
      },
    );

    it('calling media subscribable subscribe should return media subscription object exposing unsubscribe method only ', () => {
      const mediaSubscription = { unsubscribe: expect.any(Function) };
      expect(mediaSubscribable.subscribe(fullMediaObserver)).toMatchObject(
        mediaSubscription,
      );
    });
  });

  describe('unsubscribe', () => {
    let rxjsSubscriptionSpy = jest.spyOn(Subscription.prototype, 'unsubscribe');

    afterAll(() => {
      rxjsSubscriptionSpy.mockRestore();
    });

    it('calling media subscription unsubscribe should call rxjs subscription unsubscribe', () => {
      const mediaSubscription = mediaSubscribable.subscribe(fullMediaObserver);
      mediaSubscription.unsubscribe();
      expect(rxjsSubscriptionSpy).toHaveBeenCalled();
    });
  });
});
