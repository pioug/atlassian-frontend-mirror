import sinon from 'sinon';

import { flushPromises } from '@atlaskit/link-test-helpers';

import { promiseDebounce } from '../promiseDebounce';

const clock = sinon.useFakeTimers(
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'Date',
);

jest.unmock('lodash/debounce');

describe('promiseDebounce', () => {
  it('should return a fn that returns a debounced/shared promise', async () => {
    const debounceInterval = 200;

    const fn = (() => {
      let value = 0;
      return jest.fn(() => Promise.resolve(++value));
    })();

    const debounced = promiseDebounce(fn, debounceInterval);

    const a = debounced();
    const b = debounced();
    const c = debounced();

    await flushPromises();
    expect(fn).toHaveBeenCalledTimes(0);

    await flushPromises();
    clock.tick(debounceInterval);

    expect(fn).toHaveBeenCalledTimes(1);
    await expect(a).resolves.toBe(1);
    await expect(b).resolves.toBe(1);
    await expect(c).resolves.toBe(1);

    const d = debounced();
    const e = debounced();
    const f = debounced();

    await flushPromises();
    expect(fn).toHaveBeenCalledTimes(1);

    await flushPromises();
    clock.tick(debounceInterval);

    expect(fn).toHaveBeenCalledTimes(2);
    await expect(d).resolves.toBe(2);
    await expect(e).resolves.toBe(2);
    await expect(f).resolves.toBe(2);
  });

  it('should handle the rejection error properly', async () => {
    const debounceInterval = 200;

    const fn = (() => {
      let value = 0;
      return jest.fn(() => Promise.reject(++value));
    })();

    const debounced = promiseDebounce(fn, debounceInterval);

    const a = debounced();
    const b = debounced();
    const c = debounced();

    await flushPromises();
    expect(fn).toHaveBeenCalledTimes(0);

    await flushPromises();
    clock.tick(debounceInterval);

    expect(fn).toHaveBeenCalledTimes(1);
    await expect(a).rejects.toBe(1);
    await expect(b).rejects.toBe(1);
    await expect(c).rejects.toBe(1);
  });
});
