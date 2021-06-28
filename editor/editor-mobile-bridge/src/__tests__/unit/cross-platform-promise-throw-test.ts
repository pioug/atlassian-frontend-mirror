import { createPromise } from '../../cross-platform-promise';
import { toNativeBridge } from '../../editor/web-to-native';

jest.mock('../../editor/web-to-native');
toNativeBridge.submitPromise = jest.fn(() => {
  throw new Error('submitPromise failed');
});

describe('exception handling', () => {
  const promise = createPromise('getConfig');

  test('does not throw synchronously', async () => {
    expect(
      () => promise.submit().catch((err) => {}), // black-hole async errors
    ).not.toThrow();
  });

  test('rejects asynchronously', async () => {
    try {
      await promise.submit();
    } catch (err) {
      expect(err).toEqual(new Error('submitPromise failed'));
    }
  });
});
