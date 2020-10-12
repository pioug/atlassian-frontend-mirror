import * as sinon from 'sinon';

import { AbstractResource } from '../serviceResources';
import { OnProviderChange } from '../types';

class TestResource extends AbstractResource<
  string,
  string[],
  string,
  string,
  {}
> {
  filter() {}

  callNotifyResult(result: string[]) {
    this.notifyResult(result);
  }

  callNotifyError(error: string) {
    this.notifyError(error);
  }

  callNotifyInfo(info: string) {
    this.notifyInfo(info);
  }

  callNotifyNotReady() {
    this.notifyNotReady();
  }
}

class TestOnProviderChange
  implements OnProviderChange<string[], string, string> {
  result = sinon.stub();
  error = sinon.stub();
  info = sinon.stub();
  notReady = sinon.stub();
}

class MinimalTestOnProviderChange
  implements OnProviderChange<string[], string, string> {
  result = sinon.stub();
}

const result = ['a', 'b'];
const errMsg = 'error';
const infoMsg = 'info';

const testSubscriptions = (subCount: number) => {
  let resource: TestResource;
  let listeners: TestOnProviderChange[];

  beforeEach(() => {
    resource = new TestResource();
    listeners = [];
    for (let i = 0; i < subCount; i++) {
      const listener = new TestOnProviderChange();
      listeners.push(listener);
      resource.subscribe(listener);
    }
  });

  it('all listeners called on notifyResult', () => {
    resource.callNotifyResult(result);
    expect(true).toBe(true);
    listeners.forEach(listener => {
      expect(listener.result.calledWith(result)).toEqual(true);
      expect(listener.result.calledOnce).toEqual(true);
      expect(listener.error.calledOnce).toEqual(false);
      expect(listener.info.calledOnce).toEqual(false);
      expect(listener.notReady.calledOnce).toEqual(false);
    });
  });

  it('new subscriber gets notified of last result', () => {
    resource.callNotifyResult(result);
    expect(true).toBe(true);
    const listener = new TestOnProviderChange();
    resource.subscribe(listener);
    resource.callNotifyResult(result);
    expect(listener.result.calledWith(result)).toEqual(true);
    expect(listener.result.calledOnce).toEqual(true);
  });

  it('all listeners called on notifyError', () => {
    resource.callNotifyError(errMsg);
    expect(true).toBe(true);
    listeners.forEach(listener => {
      expect(listener.error.calledWith(errMsg)).toEqual(true);
      expect(listener.result.calledOnce).toEqual(false);
      expect(listener.error.calledOnce).toEqual(true);
      expect(listener.info.calledOnce).toEqual(false);
      expect(listener.notReady.calledOnce).toEqual(false);
    });
  });

  it('all listeners called on notifyInfo', () => {
    resource.callNotifyInfo(infoMsg);
    expect(true).toBe(true);
    listeners.forEach(listener => {
      expect(listener.info.calledWith(infoMsg)).toEqual(true);
      expect(listener.result.calledOnce).toEqual(false);
      expect(listener.error.calledOnce).toEqual(false);
      expect(listener.info.calledOnce).toEqual(true);
      expect(listener.notReady.calledOnce).toEqual(false);
    });
  });

  it('all listeners called on notifyNotReady', () => {
    resource.callNotifyNotReady();
    expect(true).toBe(true);
    listeners.forEach(listener => {
      expect(listener.result.calledOnce).toEqual(false);
      expect(listener.error.calledOnce).toEqual(false);
      expect(listener.info.calledOnce).toEqual(false);
      expect(listener.notReady.calledOnce).toEqual(true);
    });
  });

  it('optional callbacks are skipped', () => {
    const minimalListener = new MinimalTestOnProviderChange();
    resource.subscribe(minimalListener);
    resource.callNotifyResult(result);
    resource.callNotifyError(errMsg);
    resource.callNotifyInfo(infoMsg);
    resource.callNotifyNotReady();
    listeners.forEach(listener => {
      expect(listener.result.calledOnce).toEqual(true);
      expect(listener.error.calledOnce).toEqual(true);
      expect(listener.info.calledOnce).toEqual(true);
      expect(listener.notReady.calledOnce).toEqual(true);
    });
    expect(minimalListener.result.calledWith(result)).toEqual(true);
    expect(minimalListener.result.calledOnce).toEqual(true);
  });

  if (subCount > 0) {
    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyResult(result);
      expect(removedListener.result.calledOnce).toEqual(false);
    });

    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyError(errMsg);
      expect(removedListener.error.calledOnce).toEqual(false);
    });

    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyInfo(infoMsg);
      expect(removedListener.info.calledOnce).toEqual(false);
    });

    it('unsubscribed listeners are not called on notifyResult', () => {
      const removedListener = listeners[0];
      resource.unsubscribe(removedListener);
      resource.callNotifyNotReady();
      expect(removedListener.notReady.calledOnce).toEqual(false);
    });
  }
};

describe('AbstractResource', () => {
  describe('no subscribers', () => {
    testSubscriptions(0);
  });

  describe('one subscribers', () => {
    testSubscriptions(1);
  });

  describe('two subscribers', () => {
    testSubscriptions(2);
  });
});
