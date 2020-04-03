import {
  createPromise,
  rejectPromise,
  resolvePromise,
  setCounter,
  SubmitPromiseToNative,
} from '../../cross-platform-promise';
import { toNativeBridge } from '../../editor/web-to-native';

jest.mock('../../editor/web-to-native');
toNativeBridge.submitPromise = jest.fn();

beforeEach(() => {
  setCounter(0);
});

describe('create promise', () => {
  it('should return object', () => {
    const submittable = createPromise('getAuth', 'collection');
    expect(submittable).toBeDefined();
  });

  it('should return something submittable', () => {
    const submittable: SubmitPromiseToNative<any> = createPromise(
      'getAuth',
      'collection',
    );
    expect(submittable.submit()).toBeDefined();
  });

  it('should request execution from the web to native bridge', () => {
    createPromise('getAuth', 'collection').submit();
    expect(toNativeBridge.submitPromise).toBeCalledWith(
      'getAuth',
      '0',
      'collection',
    );
  });

  it('should assign unique identifiers to promises', () => {
    createPromise('getAuth', 'collection').submit();
    expect(toNativeBridge.submitPromise).toBeCalledWith(
      'getAuth',
      '0',
      'collection',
    );
    createPromise('getAuth', 'collection').submit();
    expect(toNativeBridge.submitPromise).toBeCalledWith(
      'getAuth',
      '1',
      'collection',
    );
  });

  it('calls sendToPromise without args when unary', () => {
    createPromise('getConfig').submit();
    expect(toNativeBridge.submitPromise).toBeCalledWith('getConfig', '0');
  });
});

describe('resolve promise', () => {
  it('should callback when created promise resolved', async () => {
    let promise = createPromise('getAuth', 'collection').submit();
    let callback = jest.fn();
    promise.then(callback);
    let data = { clientId: 'client', token: 'tokennnn' };
    resolvePromise('0', data);
    await promise;
    expect(callback).toHaveBeenCalledWith(data);
  });

  it('should be called only once', async () => {
    let promise = createPromise('getAuth', 'collection').submit();
    let callback = jest.fn();
    promise.then(callback);
    for (let i = 0; i < 2; i++) {
      let data = { clientId: 'client', token: 'tokennnn' };
      resolvePromise('0', data);
    }
    await promise;
    expect(callback.mock.calls.length).toBe(1);
  });
});

describe('reject promise', () => {
  it('should call back when promise rejected', async () => {
    let promise = createPromise('getAuth', 'collection').submit();
    let callback = jest.fn();
    promise = promise.catch(callback);
    rejectPromise('0');
    await promise;
    expect(callback.mock.calls.length).toBe(1);
  });
  it('should call back only once, when promise rejected', async () => {
    let promise = createPromise('getAuth', 'collection').submit();
    let callback = jest.fn();
    promise = promise.catch(callback);
    for (let i = 0; i < 2; i++) {
      rejectPromise('0');
    }
    await promise;
    expect(callback.mock.calls.length).toBe(1);
  });
});
