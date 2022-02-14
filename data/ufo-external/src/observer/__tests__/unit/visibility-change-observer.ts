import { visibilityChangeObserver } from '../../visibility-change-observer';

describe('visibilityChangeObserver', () => {
  test('Should invoke callback if visibilitychange event is fired ', () => {
    const callbackFn = jest.fn();
    visibilityChangeObserver.start();
    visibilityChangeObserver.subscribe(callbackFn);
    document.dispatchEvent(new Event('visibilitychange'));
    visibilityChangeObserver.unsubscribe(callbackFn);
    expect(callbackFn).toBeCalledTimes(1);
  });
  test('Should not invoke callback if visibilitychange event is not fired ', () => {
    const callbackFn = jest.fn();
    visibilityChangeObserver.start();
    visibilityChangeObserver.subscribe(callbackFn);
    visibilityChangeObserver.unsubscribe(callbackFn);
    expect(callbackFn).toBeCalledTimes(0);
  });
});
