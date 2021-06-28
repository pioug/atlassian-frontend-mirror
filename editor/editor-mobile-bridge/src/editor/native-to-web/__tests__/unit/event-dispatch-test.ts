import {
  BridgeEventEmitter,
  EventTypes,
  allowListPayloadType,
} from '../../../event-dispatch';
import * as sinon from 'sinon';

const testData: allowListPayloadType = new Set(['heading1', 'heading2']);
const eventType: EventTypes = EventTypes.SET_NEW_ALLOWED_INSERT_LIST;

describe('event dispatcher', () => {
  let eventEmitter: BridgeEventEmitter;

  beforeEach(() => {
    eventEmitter = new BridgeEventEmitter();
  });

  it('should emit a single event', (done) => {
    eventEmitter.on(eventType, (payload: allowListPayloadType) => {
      expect(payload).toBe(testData);
      done();
    });

    eventEmitter.emit(eventType, testData);
  });

  it('emits multiple calls to event ', (done) => {
    const callBack = sinon.spy(completed);
    eventEmitter.on(eventType, callBack);
    eventEmitter.emit(eventType, testData);
    eventEmitter.emit(eventType, testData);

    function completed(payload: allowListPayloadType) {
      if (callBack.callCount < 2) {
        return;
      }
      expect(payload).toBe(testData);
      expect(callBack.callCount).toBe(2);
      done();
    }
  });

  it('should add one listener', () => {
    eventEmitter.on(eventType, () => {});
    const listners = eventEmitter.listeners(eventType);
    expect(listners.length).toBe(1);
  });

  it('should remove added listener', () => {
    const cb = () => {};
    eventEmitter.on(eventType, cb);
    const listners = eventEmitter.listeners(eventType);
    expect(listners.length).toBe(1);
    eventEmitter.off(eventType, cb);
    const listnersAfter = eventEmitter.listeners(eventType);
    expect(listnersAfter.length).toBe(0);
  });
});
