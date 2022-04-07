import {
  getGlobalEventStream,
  setGlobalEventStream,
} from '../../../global-stream-buffer';

describe('getGlobalEventStream', () => {
  beforeEach(() => {
    globalThis.__UFO_GLOBAL_EVENT_STREAM__ = undefined;
  });

  test('Should get the early global event stream buffer object', () => {
    const buffer = getGlobalEventStream();
    expect(buffer.__buffer_only__).toBeTruthy();
    expect(typeof buffer.push === 'function').toBeTruthy();
    expect(typeof (buffer as any).getStream === 'function').toBeTruthy();
  });

  test('Should not create a new object for global event stream buffer object if it already exists', () => {
    const buffer = getGlobalEventStream();
    const buffer2 = getGlobalEventStream();
    expect(buffer === buffer2).toBeTruthy();
  });

  test('Should set a new global event stream if it does not exist', () => {
    const buffer = getGlobalEventStream();
    globalThis.__UFO_GLOBAL_EVENT_STREAM__ = undefined;
    setGlobalEventStream(buffer);
    expect(globalThis.__UFO_GLOBAL_EVENT_STREAM__ === buffer).toBeTruthy();
  });
});
