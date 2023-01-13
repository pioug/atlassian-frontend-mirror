/**
 * @jest-environment jsdom
 */
/* eslint-disable @atlaskit/platform/ensure-feature-flag-registration */

beforeEach(() => {
  jest.resetModules();

  delete globalThis.__AF_PLATFORM_FLAGS;
});

type Api = typeof import('../index');

const loadApi = (): Api => {
  let module: Api;

  jest.isolateModules(() => {
    module = jest.requireActual('../index');
  });

  return module!;
};

describe('feature flags API', () => {
  it('should return false when getting undefined value of FF', () => {
    // given, when
    const { getBooleanFF } = loadApi();

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-random-undefined-ff')).toBe(false);
  });

  it('should return true when setting and then getting a value of defined FF', () => {
    // given
    const { getBooleanFF, setBooleanFF } = loadApi();

    // when
    // @ts-expect-error flag doesn't exist
    setBooleanFF('my-flag', true);

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-flag')).toBe(true);
  });

  it('should ignore a non-boolean value when setting FF and then fallback to false value', () => {
    // given
    const { getBooleanFF, setBooleanFF } = loadApi();

    // when
    // @ts-expect-error - we are testing the runtime behaviour when passing a non-boolean value
    setBooleanFF('my-new-flag', 'red!');

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-new-flag')).toBe(false);
  });
});

describe('FF overrides', () => {
  it('should return true when getting a pre-defined FF value', () => {
    // given, when
    globalThis.__AF_PLATFORM_FLAGS = {
      'my-pre-defined-flag': true,
    };
    const { getBooleanFF } = loadApi();

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-pre-defined-flag')).toBe(true);
  });

  it('should return false when getting a pre-defined FF value that was disabled', () => {
    // given, when
    globalThis.__AF_PLATFORM_FLAGS = {
      'my-pre-defined-flag': false,
    };
    const { getBooleanFF } = loadApi();

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-pre-defined-flag')).toBe(false);
  });

  it('should return false when trying to override a pre-defined FF value that was disabled', () => {
    // given
    globalThis.__AF_PLATFORM_FLAGS = {
      'my-pre-defined-flag': false,
    };
    const { getBooleanFF, setBooleanFF } = loadApi();

    // when
    // @ts-expect-error flag doesn't exist
    setBooleanFF('my-pre-defined-flag', true);

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-pre-defined-flag')).toBe(false);
  });

  it('should return false when trying to pre-define a non-boolean FF value', () => {
    // given, when
    globalThis.__AF_PLATFORM_FLAGS = {
      // @ts-expect-error - we are testing the runtime behaviour when passing a non-boolean value
      'my-invalid-pre-defined-flag': 'foo',
    };
    const { getBooleanFF } = loadApi();

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-invalid-pre-defined-flag')).toBe(false);
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
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-platform-feature-flag')).toBe(true);
  });

  it('should always return true when getting a FF value while running tests with "STORYBOOK_ENABLE_PLATFORM_FF" environment flag', () => {
    // given
    process.env.STORYBOOK_ENABLE_PLATFORM_FF = 'true';

    // when
    const { getBooleanFF } = loadApi();

    //then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('my-platform-feature-flag')).toBe(true);
  });
});

describe('browser environment', () => {
  beforeEach(() => {
    // @ts-expect-error Yep, we are running dangerous operation here
    delete globalThis.process;
  });

  it('should work when "process" variable doesn\'t exist', function () {
    // given, when
    const { getBooleanFF } = loadApi();

    // then
    // @ts-expect-error flag doesn't exist
    expect(getBooleanFF('browser.my-platform-feature-flag')).toBe(false);
  });
});

export {};
