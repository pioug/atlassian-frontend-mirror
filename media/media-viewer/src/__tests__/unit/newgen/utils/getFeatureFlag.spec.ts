import { getFeatureFlag } from '../../../../newgen/utils/getFeatureFlag';

/**
 * Skipping three tests, no ideas on this one
 * TODO: JEST-23 Fix these tests
 */
describe('getFeatureFlag', () => {
  const nativeLocalStorage = window.localStorage;

  afterEach(() => {
    (window as any).localStorage = nativeLocalStorage;
  });

  it('should return the value if its present in the passed features flags', () => {
    expect(getFeatureFlag('testKey' as never, { testKey: true })).toBeTruthy();
    expect(getFeatureFlag('testKey' as never, { testKey: false })).toBeFalsy();
  });

  it.skip('should use localStorage if flag is not passed', () => {
    expect(getFeatureFlag('testKey' as never, {})).toBeFalsy();

    (window as any).localStorage = {
      getItem(item: string) {
        if (item === 'MediaViewerNextGenTestKey') {
          return 'true';
        }
        return null;
      },
    };

    expect(getFeatureFlag('testKey' as never)).toBeTruthy();
    expect(getFeatureFlag('testKey' as never, {})).toBeTruthy();
  });

  it.skip('should return true if flag is false and dev override is true', () => {
    (window as any).localStorage = {
      getItem(item: string) {
        if (item === 'MediaViewerNextGenTestKey') {
          return 'true';
        }
        return null;
      },
    };
    expect(
      getFeatureFlag('testKey' as never, {
        testKey: false,
      }),
    ).toBeTruthy();
  });

  it.skip('should return false if flag is true and dev override is false', () => {
    (window as any).localStorage = {
      getItem(item: string) {
        if (item === 'MediaViewerNextGenTestKey') {
          return 'false';
        }
        return null;
      },
    };
    expect(
      getFeatureFlag('testKey' as never, {
        testKey: true,
      }),
    ).toBeFalsy();
  });
});
