/**
 * @jest-environment jsdom
 */
/* eslint-disable @atlaskit/platform/ensure-feature-flag-registration */
/* eslint-disable @atlaskit/platform/no-invalid-feature-flag-usage */

import { FeatureFlagResolverBoolean } from '../resolvers';

beforeEach(() => {
  jest.resetModules();
});

type Api = typeof import('../index');

const loadApi = (): Api => {
  let module: Api;

  jest.isolateModules(() => {
    module = jest.requireActual('../index');
  });

  return module!;
};

/* eslint-disable no-console */
describe('feature flags API', () => {
  it('should return false when getting undefined value of FF', () => {
    // given, when
    const { getBooleanFF } = loadApi();

    // then
    expect(getBooleanFF('my-random-undefined-ff')).toBe(false);
  });

  it('should return true when setting and then getting a value of defined FF', () => {
    console.debug = jest.fn();

    // given
    const { getBooleanFF, setBooleanFeatureFlagResolver } = loadApi();

    // when
    const resolver: FeatureFlagResolverBoolean = (key) => {
      return key === 'my-flag';
    };

    setBooleanFeatureFlagResolver(resolver);

    // then
    expect(console.debug).toHaveBeenCalledTimes(0);
    expect(getBooleanFF('my-flag')).toBe(true);
  });

  it('should ignore a non-boolean value when resolving FF and throw invariant error', () => {
    console.debug = jest.fn();

    // given
    const { getBooleanFF, setBooleanFeatureFlagResolver } = loadApi();

    // when
    // @ts-expect-error - we are testing the runtime behaviour when passing a non-boolean value
    const resolver: FeatureFlagResolverBoolean = (key) => {
      if (key === 'my-new-flag') {
        return 'red!';
      }
      return false;
    };
    setBooleanFeatureFlagResolver(resolver);

    // then
    expect(console.debug).toHaveBeenCalledTimes(0);
    expect(getBooleanFF('my-new-flag')).toEqual(false);
  });

  it('should log a collection of feature flags that are called before setBooleanFeatureFlagResolver is initialised', () => {
    console.debug = jest.fn();

    // given
    const { getBooleanFF, setBooleanFeatureFlagResolver } = loadApi();

    // when
    getBooleanFF('early-flag-1');
    getBooleanFF('early-flag-3');
    getBooleanFF('early-flag-3');
    getBooleanFF('early-flag-3');
    getBooleanFF('early-flag-2');
    getBooleanFF('early-flag-2');

    const resolver: FeatureFlagResolverBoolean = () => {
      return true;
    };

    setBooleanFeatureFlagResolver(resolver);

    getBooleanFF('my-feature-flag');

    setBooleanFeatureFlagResolver(resolver);

    // then
    expect(console.debug).toHaveBeenCalledTimes(1);
    expect(console.debug).toHaveBeenCalledWith(
      '[%s]: The following list of Feature Flags were called, the following number of times, before setBooleanResolver.',
      '@atlaskit/platform-feature-flags',
      [
        ['early-flag-1', 1],
        ['early-flag-3', 3],
        ['early-flag-2', 2],
      ],
    );
  });
});

describe('tests support', function () {
  beforeEach(() => {
    delete globalThis.process.env.ENABLE_PLATFORM_FF;
    delete globalThis.process.env.STORYBOOK_ENABLE_PLATFORM_FF;
  });

  it('should always return true when getting a FF value while running tests with "ENABLE_PLATFORM_FF" environment flag', () => {
    // given
    globalThis.process.env.ENABLE_PLATFORM_FF = 'true';

    // when
    const { getBooleanFF } = loadApi();

    //then
    expect(getBooleanFF('my-platform-feature-flag')).toBe(true);
  });

  it('should always return true when getting a FF value while running tests with "STORYBOOK_ENABLE_PLATFORM_FF" environment flag', () => {
    // given
    process.env.STORYBOOK_ENABLE_PLATFORM_FF = 'true';

    // when
    const { getBooleanFF } = loadApi();

    //then
    expect(getBooleanFF('my-platform-feature-flag')).toBe(true);
  });
});

describe('browser environment', () => {
  const orgProcess = globalThis.process;

  beforeEach(() => {
    globalThis.process = orgProcess;

    console.assert(globalThis.process);
    console.assert(globalThis.process.env);
  });

  it(`should work when "process" variable doesn't exist`, function () {
    // given
    // @ts-expect-error Yep, we are running dangerous operation here
    delete globalThis.process;

    expect(globalThis.process).toBe(undefined);

    // when
    const { getBooleanFF } = loadApi();

    // then
    expect(getBooleanFF('browser.my-platform-feature-flag')).toBe(false);
  });

  it(`should work when "process" variable exists by "process.env" does not`, function () {
    // given
    // @ts-expect-error Yep, we are running dangerous operation here
    delete globalThis.process.env;

    expect(globalThis.process).toBeDefined();
    expect(globalThis.process.env).toBe(undefined);

    // when
    const { getBooleanFF } = loadApi();

    // then
    expect(getBooleanFF('browser.my-platform-feature-flag')).toBe(false);
  });
});

/* eslint-enable no-console */
