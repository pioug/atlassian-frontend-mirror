import FeatureFlagClient from '../../client';
import {
  AnalyticsHandler,
  CustomAttributes,
  ExposureTriggerReason,
  Flags,
  FlagShape,
  ReservedAttributes,
} from '../../types';

const defaultFlags: Flags = {
  'simple.flag': {
    value: false,
    explanation: {
      kind: 'SIMPLE_EVAL',
    },
  },
  boolean: {
    value: true,
  },
  'detailed.boolean': {
    value: false,
    explanation: {
      kind: 'RULE_MATCH',
      ruleId: '111-bbbbb-ccc',
      ruleIndex: 1,
    },
  },
  variation: {
    value: 'experiment',
  },
  'detailed.variation': {
    value: 'control',
    explanation: {
      kind: 'RULE_MATCH',
      ruleId: '222-ccccc-ddd',
    },
  },
  json: {
    value: {
      nav: 'blue',
      footer: 'black',
    },
  },
  'detailed.json': {
    value: {
      nav: 'blue',
      footer: 'black',
    },
    explanation: {
      kind: 'RULE_MATCH',
      ruleId: '333-ddddd-eee',
    },
  },
  null: {
    // @ts-ignore Worst case
    value: null,
    explanation: {
      kind: 'SIMPLE_EVAL',
    },
  },
  undefined: {
    // @ts-ignore Worst case
    value: null,
    explanation: {
      kind: 'SIMPLE_EVAL',
    },
  },
  zero: {
    // @ts-ignore We dont allow numbers
    value: 0,
    explanation: {
      kind: 'SIMPLE_EVAL',
    },
  },
};

describe('Feature Flag Client', () => {
  let analyticsHandler: AnalyticsHandler;
  let client: FeatureFlagClient;

  const createDefaultClient = (
    isAutomaticExposuresEnabled: boolean = true,
  ): FeatureFlagClient => {
    return new FeatureFlagClient({
      analyticsHandler,
      flags: defaultFlags,
      isAutomaticExposuresEnabled,
    });
  };

  const assertCustomExposureSent = (
    baseAttributes: ReservedAttributes,
    customAttributes: CustomAttributes,
    exposureTag: ExposureTriggerReason = ExposureTriggerReason.Default,
  ) => {
    expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledTimes(2);
    expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
      action: 'exposed',
      actionSubject: 'feature',
      attributes: baseAttributes,
      tags: ['measurement', exposureTag],
      highPriority: false,
      source: '@atlaskit/feature-flag-client',
    });
    expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
      action: 'exposed',
      actionSubject: 'feature',
      attributes: {
        ...baseAttributes,
        ...customAttributes,
      },
      tags: [
        'measurement',
        ExposureTriggerReason.hasCustomAttributes,
        exposureTag,
      ],
      highPriority: true,
      source: '@atlaskit/feature-flag-client',
    });
  };

  const assertExposureSent = (
    exposureTag: ExposureTriggerReason = ExposureTriggerReason.Default,
    attributes?: ReservedAttributes,
  ) => {
    expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledTimes(1);
    expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
      action: 'exposed',
      actionSubject: 'feature',
      attributes: attributes || expect.any(Object),
      tags: ['measurement', exposureTag],
      highPriority: false,
      source: '@atlaskit/feature-flag-client',
    });
  };

  const assertNoExposures = () => {
    expect(analyticsHandler.sendOperationalEvent).not.toHaveBeenCalled();
  };

  beforeEach(() => {
    analyticsHandler = { sendOperationalEvent: jest.fn() };
    client = createDefaultClient();
  });

  describe('bootstrap', () => {
    test('should throw if no analytics handler is given', () => {
      expect(() => new FeatureFlagClient({} as any)).toThrowError(
        'Feature Flag Client: Missing analyticsHandler',
      );
    });

    test('should allow to bootstrap with flags', () => {
      const client = new FeatureFlagClient({
        analyticsHandler,
        flags: {
          'my.flag': { value: false },
        },
      });

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(false);
    });

    test('should allow to set flags later', () => {
      const client = createDefaultClient();

      client.setFlags({
        'my.first.flag': { value: true },
      });

      client.setFlags({
        'my.second.flag': {
          value: 'experiment',
          explanation: {
            kind: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
          },
        },
      });

      expect(client.getBooleanValue('boolean', { default: false })).toBe(true);
      expect(client.getBooleanValue('my.first.flag', { default: false })).toBe(
        true,
      );
      expect(
        client.getVariantValue('my.second.flag', {
          default: 'control',
          oneOf: ['control', 'experiment'],
        }),
      ).toBe('experiment');
    });
  });

  describe('clear', () => {
    test('should remove all flags', () => {
      const client = createDefaultClient();

      expect(client.getBooleanValue('boolean', { default: false })).toBe(true);

      client.clear();

      expect(client.getBooleanValue('boolean', { default: false })).toBe(false);
    });
  });

  describe('getters', () => {
    describe('getBooleanValue', () => {
      test('should throw if called without default', () => {
        expect(() =>
          expect(client.getBooleanValue('my.flag', {} as any)),
        ).toThrow('getBooleanValue: Missing default');
      });

      test('should return default if flag is not set', () => {
        expect(client.getBooleanValue('missing.flag', { default: false })).toBe(
          false,
        );
      });

      test('should throw in DEV if flag does not have a "value" attribute', () => {
        const createClient = () =>
          new FeatureFlagClient({
            analyticsHandler,
            flags: {
              'my.flag': false,
            } as any,
          });

        expect(createClient).toThrow('my.flag is not a valid flag');
      });

      test('should return default if flag is not boolean', () => {
        expect(
          client.getBooleanValue('detailed.variation', { default: false }),
        ).toBe(false);

        expect(client.getBooleanValue('variation', { default: false })).toBe(
          false,
        );
      });

      test('should return the right value when the flag is boolean', () => {
        const client = createDefaultClient();

        expect(client.getBooleanValue('boolean', { default: false })).toBe(
          true,
        );
      });

      test('should fire the exposure event if the flag contains evaluation details (long format / feature flag)', () => {
        expect(
          client.getBooleanValue('detailed.boolean', { default: true }),
        ).toBe(false);
        assertExposureSent(ExposureTriggerReason.Default, {
          flagKey: 'detailed.boolean',
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
          value: false,
        });
      });

      test('should not fire the exposure event if shouldTrackExposureEvent is false', () => {
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getBooleanValue('detailed.boolean', {
            default: true,
            shouldTrackExposureEvent: false,
          }),
        ).toBe(false);
        assertNoExposures();
      });

      test('should allow for extra attributes in the exposure event', () => {
        const customAttributes = {
          permissions: 'read',
          section: 'view-page',
        };
        expect(
          client.getBooleanValue('detailed.boolean', {
            default: true,
            exposureData: customAttributes,
          }),
        ).toBe(false);

        assertCustomExposureSent(
          {
            flagKey: 'detailed.boolean',
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: false,
          },
          customAttributes,
        );
      });

      test('should not allow extra attributes conflicting with reserved attributes', () => {
        const errorMessage =
          'exposureData contains a reserved attribute. Reserved attributes are: flagKey, ruleId, reason, value, errorKind';

        expect(() =>
          client.getBooleanValue('detailed.boolean', {
            default: true,
            exposureData: {
              value: 'special',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(() =>
          client.getBooleanValue('detailed.boolean', {
            default: true,
            exposureData: {
              ruleId: 'reserved-1111',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(() =>
          client.getBooleanValue('detailed.boolean', {
            default: true,
            exposureData: {
              flagKey: 'reserved.key',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(() =>
          client.getBooleanValue('detailed.boolean', {
            default: true,
            exposureData: {
              reason: 'RESERVED',
            },
          }),
        ).toThrow(new TypeError(errorMessage));
      });

      test('should return the same value on repeated calls where the flag is in a valid state', () => {
        expect(
          client.getBooleanValue('boolean', {
            default: false,
          }),
        ).toBe(true);
        expect(
          client.getBooleanValue('boolean', {
            default: false,
          }),
        ).toBe(true);
      });

      test('should return the passed in default value for repeated calls when the flag is in an invalid state', () => {
        // Same flag key, same validation rules, but different defaults
        const firstEvalResult = client.getBooleanValue('variation', {
          default: false,
        });
        const secondEvalResult = client.getBooleanValue('variation', {
          default: true,
        });

        expect(firstEvalResult).toBe(false);
        expect(secondEvalResult).toBe(true);
      });

      test('should return the cached result of the first evaluation for the flag key, even if it does not match the type we are asking for', () => {
        const firstEvalResult = client.getVariantValue('variation', {
          oneOf: ['control', 'experiment'],
          default: 'control',
        });
        const secondEvalResult = client.getBooleanValue('variation', {
          default: false,
        });

        expect(firstEvalResult).toBe('experiment');
        expect(secondEvalResult).toBe('experiment');
      });

      test('should allow exposure events to be suppressed on the initial call, and fired in a later call instead', () => {
        client.setIsAutomaticExposuresEnabled(false);
        client.getBooleanValue('detailed.boolean', {
          default: false,
          shouldTrackExposureEvent: false,
        });
        assertNoExposures();
        client.getBooleanValue('detailed.boolean', {
          default: false,
          shouldTrackExposureEvent: true,
        });
        assertExposureSent(ExposureTriggerReason.OptIn, {
          flagKey: 'detailed.boolean',
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
          value: false,
        });
      });
    });

    describe('getVariantValue', () => {
      test('should throw if called without default', () => {
        expect(() =>
          client.getVariantValue('my.flag', {
            oneOf: ['control', 'experiment'],
          } as any),
        ).toThrow('getVariantValue: Missing default');
      });

      test('should throw if called without oneOf', () => {
        expect(() =>
          client.getVariantValue('my.flag', { default: 'control' } as any),
        ).toThrow('getVariantValue: Missing oneOf');
      });

      test('should return default if flag is not set, and not fire exposure event', () => {
        // Test would send exposures for missing flags if automatic exposures is on
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getVariantValue('missing.flag', {
            default: 'control',
            oneOf: ['control', 'experiment'],
            shouldTrackExposureEvent: true,
          }),
        ).toBe('control');
        assertNoExposures();
      });

      test('should return default if flag is boolean, and not fire exposure event', () => {
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getVariantValue('detailed.boolean', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        assertNoExposures();
      });

      test('should return default if flag is not listed as oneOf, and should not fire an exposure event', () => {
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getVariantValue('detailed.variation', {
            default: 'not-valid-1',
            oneOf: ['not-valid-1', 'not-valid-2'],
          }),
        ).toBe('not-valid-1');
        assertNoExposures();
      });

      test('should return the right value if flag is listed as oneOf, and fire exposure event', () => {
        expect(
          client.getVariantValue('detailed.variation', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');

        assertExposureSent(ExposureTriggerReason.Default, {
          flagKey: 'detailed.variation',
          reason: 'RULE_MATCH',
          ruleId: '222-ccccc-ddd',
          value: 'control',
        });
      });

      test('should return the right value if flag is listed as oneOf and is a dark feature', () => {
        expect(
          client.getVariantValue('variation', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('experiment');
      });

      test('should not fire exposure event if shouldTrackExposureEvent is false', () => {
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getVariantValue('detailed.variation', {
            default: 'control',
            oneOf: ['control', 'experiment'],
            shouldTrackExposureEvent: false,
          }),
        ).toBe('control');
        assertNoExposures();
      });

      test('should allow for extra attributes in the exposure event', () => {
        const customAttributes = {
          permissions: 'read',
          container: 'space',
        };
        expect(
          client.getVariantValue('detailed.variation', {
            default: 'control',
            oneOf: ['control', 'experiment'],
            exposureData: customAttributes,
          }),
        ).toBe('control');
        assertCustomExposureSent(
          {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: '222-ccccc-ddd',
            value: 'control',
          },
          customAttributes,
        );
      });

      describe('invalid types', () => {
        const STRING_DEFAULT_VALUE = 'defaultValue';
        const STRING_TEST_VALUE = 'string';

        const INVALID_ITEMS: any = {
          boolean: true,
          object: {},
          zero: 0,
          number: 100,
          'string-not-in-possibleValues': 'abc',
        };

        Object.keys(INVALID_ITEMS).forEach((key: string) => {
          const wrongValue = INVALID_ITEMS[key];

          test(`should fall back to defaultValue when given ${key}`, () => {
            const client = new FeatureFlagClient({
              analyticsHandler,
              flags: {
                'some-flag': {
                  value: wrongValue,
                },
              },
            });

            expect(
              client.getVariantValue('some-flag', {
                default: STRING_DEFAULT_VALUE,
                oneOf: [STRING_TEST_VALUE],
              }),
            ).toBe(STRING_DEFAULT_VALUE);
          });
        });
      });

      test('should return the same value on repeated calls where the flag is in a valid state', () => {
        const firstEvalResult = client.getVariantValue('variation', {
          oneOf: ['control', 'experiment'],
          default: 'control',
        });
        const secondEvalResult = client.getVariantValue('variation', {
          oneOf: ['control', 'experiment'],
          default: 'control',
        });

        expect(firstEvalResult).toBe('experiment');
        expect(secondEvalResult).toBe('experiment');
      });

      test('should return the passed in default value for repeated calls when the flag is in an invalid state', () => {
        // Same flag key, same validation rules, but different defaults
        const firstEvalResult = client.getVariantValue('boolean', {
          oneOf: ['control', 'experiment'],
          default: 'control',
        });
        const secondEvalResult = client.getVariantValue('boolean', {
          oneOf: ['control', 'experiment'],
          default: 'experiment',
        });

        expect(firstEvalResult).toBe('control');
        expect(secondEvalResult).toBe('experiment');
      });

      test('should return the cached result of the first evaluation for the flag key, even if it does not match the type we are asking for', () => {
        const firstEvalResult = client.getBooleanValue('boolean', {
          default: false,
        });
        const secondEvalResult = client.getVariantValue('boolean', {
          oneOf: ['control', 'experiment'],
          default: 'control',
        });

        expect(firstEvalResult).toBe(true);
        expect(secondEvalResult).toBe(true);
      });

      test('should allow exposure events to be suppressed on the initial call, and fired in a later call instead', () => {
        client.setIsAutomaticExposuresEnabled(false);
        client.getVariantValue('detailed.variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
          shouldTrackExposureEvent: false,
        });
        client.getVariantValue('detailed.variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
          shouldTrackExposureEvent: true,
        });
        assertExposureSent(ExposureTriggerReason.OptIn, {
          flagKey: 'detailed.variation',
          reason: 'RULE_MATCH',
          ruleId: '222-ccccc-ddd',
          value: 'control',
        });
      });
    });

    describe('getJSONValue', () => {
      test('should return empty object if flag is not set, and not fire exposure event', () => {
        expect(client.getJSONValue('missing.flag')).toEqual({});
      });

      test('should return empty object if the flag is not a json flag', () => {
        expect(client.getJSONValue('boolean')).toEqual({});
        expect(client.getJSONValue('variation')).toEqual({});
      });

      test('should return the object if flag is set', () => {
        expect(client.getJSONValue('detailed.json')).toEqual({
          nav: 'blue',
          footer: 'black',
        });
      });

      test('should accept simple flags', () => {
        expect(client.getJSONValue('json')).toEqual({
          nav: 'blue',
          footer: 'black',
        });
      });

      test('should return the same value on repeated calls where the flag is in a valid state', () => {
        const firstEvalResult = client.getJSONValue('json');
        const secondEvalResult = client.getJSONValue('json');

        expect(firstEvalResult).toEqual({
          nav: 'blue',
          footer: 'black',
        });
        expect(secondEvalResult).toEqual({
          nav: 'blue',
          footer: 'black',
        });
      });

      test('should return the cached result of the first evaluation for the flag key, even if it does not match the type we are asking for', () => {
        const firstEvalResult = client.getBooleanValue('boolean', {
          default: false,
        });
        const secondEvalResult = client.getJSONValue('boolean');

        expect(firstEvalResult).toBe(true);
        expect(secondEvalResult).toBe(true);
      });
    });

    describe('getRawValue', () => {
      test('should throw if called without default', () => {
        expect(() =>
          client.getRawValue('missing.flag', {
            oneOf: ['control', 'experiment'],
          } as any),
        ).toThrow('getRawValue: Missing default');
      });

      test('should return default if flag is not set, and not fire exposure event', () => {
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getRawValue('missing.flag', {
            default: 'control',
          }),
        ).toBe('control');
        assertNoExposures();
      });

      test('should return value if flag is set to different type', () => {
        expect(
          client.getRawValue('variation', {
            default: false,
          }),
        ).toBe('experiment');
      });

      test('should return the right value if the flag is a boolean, and fire exposure event', () => {
        expect(
          client.getRawValue('detailed.boolean', {
            default: false,
          }),
        ).toBe(false);
        assertExposureSent(ExposureTriggerReason.Default, {
          flagKey: 'detailed.boolean',
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
          value: false,
        });
      });

      test('should return the right value if the flag is a string, and fire exposure event', () => {
        expect(
          client.getRawValue('detailed.variation', {
            default: 'control',
          }),
        ).toBe('control');
        assertExposureSent(ExposureTriggerReason.Default, {
          flagKey: 'detailed.variation',
          reason: 'RULE_MATCH',
          ruleId: '222-ccccc-ddd',
          value: 'control',
        });
      });

      test('should return the right value if the flag is an object, and fire exposure event', () => {
        expect(
          client.getRawValue('detailed.json', {
            default: {},
          }),
        ).toEqual({
          nav: 'blue',
          footer: 'black',
        });
        assertExposureSent(ExposureTriggerReason.Default, {
          flagKey: 'detailed.json',
          reason: 'RULE_MATCH',
          ruleId: '333-ddddd-eee',
          value: {
            nav: 'blue',
            footer: 'black',
          },
        });
      });

      test('should not fire exposure event if shouldTrackExposureEvent is false', () => {
        client.setIsAutomaticExposuresEnabled(false);
        expect(
          client.getRawValue('detailed.variation', {
            default: 'control',
            shouldTrackExposureEvent: false,
          }),
        ).toBe('control');
        assertNoExposures();
      });

      test('should allow for extra attributes in the exposure event', () => {
        const customAttributes = {
          permissions: 'read',
          container: 'space',
        };
        expect(
          client.getRawValue('detailed.variation', {
            default: 'control',
            exposureData: customAttributes,
          }),
        ).toBe('control');
        assertCustomExposureSent(
          {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: '222-ccccc-ddd',
            value: 'control',
          },
          customAttributes,
        );
      });

      test('should return the same value on repeated calls where the flag is in a valid state', () => {
        const firstEvalResult = client.getRawValue('boolean', {
          default: false,
        });
        const secondEvalResult = client.getRawValue('boolean', {
          default: false,
        });

        expect(firstEvalResult).toBe(true);
        expect(secondEvalResult).toBe(true);
      });

      test('should return the passed in default value for repeated calls when the flag is in an invalid state', () => {
        // Same flag key, same validation rules, but different defaults
        const firstEvalResult = client.getRawValue('missing.flag', {
          default: false,
        });
        const secondEvalResult = client.getRawValue('missing.flag', {
          default: 'experiment',
        });

        expect(firstEvalResult).toBe(false);
        expect(secondEvalResult).toBe('experiment');
      });

      test('should allow exposure events to be suppressed on the initial call, and fired in a later call instead', () => {
        client.setIsAutomaticExposuresEnabled(false);

        client.getRawValue('detailed.boolean', {
          default: false,
          shouldTrackExposureEvent: false,
        });
        assertNoExposures();
        client.getRawValue('detailed.boolean', {
          default: false,
          shouldTrackExposureEvent: true,
        });
        assertExposureSent(ExposureTriggerReason.OptIn, {
          flagKey: 'detailed.boolean',
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
          value: false,
        });
      });
    });

    describe('getFlagStats', () => {
      test('should reset the stats for any flags that are reset through setFlags', () => {
        expect(client.getFlagStats()).toEqual({});

        client.getVariantValue('variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
        });

        expect(client.getFlagStats()).toEqual({
          variation: {
            evaluationCount: 1,
          },
        });

        client.setFlags({
          variation: {
            value: 'control',
            explanation: {
              kind: 'RULE_MATCH',
              ruleId: '111-bbbbb-ccc',
            },
          },
        });

        expect(client.getFlagStats()).toEqual({});
      });

      test('should reset the stats if all flags are cleared', () => {
        expect(client.getFlagStats()).toEqual({});

        client.getVariantValue('variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
        });

        expect(client.getFlagStats()).toEqual({
          variation: {
            evaluationCount: 1,
          },
        });

        client.clear();

        expect(client.getFlagStats()).toEqual({});
      });

      test('should return the expected evaluation count for valid flags', () => {
        const evaluationCount = 5;
        for (let i = 0; i < evaluationCount; i++) {
          client.getBooleanValue('boolean', {
            default: false,
          });
        }

        expect(client.getFlagStats()).toEqual({
          boolean: {
            evaluationCount,
          },
        });
      });

      test('should return the expected evaluation count for missing flags', () => {
        const evaluationCount = 5;
        for (let i = 0; i < evaluationCount; i++) {
          client.getBooleanValue('missing.flag', {
            default: false,
          });
        }

        expect(client.getFlagStats()).toEqual({
          'missing.flag': {
            evaluationCount,
          },
        });
      });
    });
  });

  describe('exposures', () => {
    describe('Automatic Exposures Mode', () => {
      test('enableAutomaticExposures should be false by default', () => {
        client = createDefaultClient(false);
        client.getVariantValue('detailed.variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
          shouldTrackExposureEvent: false,
        });
        client.getVariantValue('variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
        });
        assertNoExposures();
      });

      test('enableAutomaticExposures should be able to set to true', () => {
        client = createDefaultClient(true);
        client.getVariantValue('detailed.variation', {
          default: 'control',
          oneOf: ['control', 'experiment'],
        });
        assertExposureSent(ExposureTriggerReason.Default, {
          flagKey: 'detailed.variation',
          reason: 'RULE_MATCH',
          ruleId: '222-ccccc-ddd',
          value: 'control',
        });
      });

      describe('getters with AutomaticExposuresMode', () => {
        describe('getBooleanValue', () => {
          test('with automode true, shouldTrackExposureEvent false; should fire automatic exposure event not track event', () => {
            expect(
              client.getBooleanValue('detailed.boolean', {
                default: true,
                shouldTrackExposureEvent: false,
              }),
            ).toBe(false);

            assertExposureSent(ExposureTriggerReason.AutoExposure, {
              flagKey: 'detailed.boolean',
              reason: 'RULE_MATCH',
              ruleId: '111-bbbbb-ccc',
              value: false,
            });
          });

          test('with automode true, shouldTrackExposureEvent true and a flag with evalutation details; should only fire one event', () => {
            expect(
              client.getBooleanValue('detailed.boolean', {
                default: true,
                shouldTrackExposureEvent: true,
              }),
            ).toBe(false);

            assertExposureSent(ExposureTriggerReason.OptIn, {
              flagKey: 'detailed.boolean',
              reason: 'RULE_MATCH',
              ruleId: '111-bbbbb-ccc',
              value: false,
            });
          });

          test('with automode true, shouldTrackExposureEvent false; should fire only automatic exposure event', () => {
            expect(
              client.getBooleanValue('detailed.boolean', {
                default: true,
                shouldTrackExposureEvent: false,
              }),
            ).toBe(false);

            assertExposureSent(ExposureTriggerReason.AutoExposure, {
              flagKey: 'detailed.boolean',
              reason: 'RULE_MATCH',
              ruleId: '111-bbbbb-ccc',
              value: false,
            });
          });

          test('should only send 1 automatic exposure event if flag is evaluated more than once', () => {
            client.getBooleanValue('detailed.boolean', {
              default: true,
              shouldTrackExposureEvent: false,
            });

            client.getBooleanValue('detailed.boolean', {
              default: true,
              shouldTrackExposureEvent: false,
            });
            client.getBooleanValue('detailed.boolean', {
              default: true,
              shouldTrackExposureEvent: false,
            });

            expect(analyticsHandler.sendOperationalEvent).toBeCalledTimes(1);
          });

          test('should still send custom event if exposureDetails is later enabled', () => {
            const customAttributes = {
              hello: 'world',
            };
            client.getBooleanValue('detailed.boolean', {
              default: true,
            });

            assertExposureSent(ExposureTriggerReason.Default, {
              flagKey: 'detailed.boolean',
              reason: 'RULE_MATCH',
              ruleId: '111-bbbbb-ccc',
              value: false,
            });

            client.getBooleanValue('detailed.boolean', {
              default: true,
              exposureData: customAttributes,
            });

            assertCustomExposureSent(
              {
                flagKey: 'detailed.boolean',
                reason: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
                value: false,
              },
              customAttributes,
              ExposureTriggerReason.Default,
            );
          });

          describe('Invalid types on default value and flag value', () => {
            test('should send automatic exposure event with errorKind:WRONG_TYPE if type of default value does not match type of flag value for flag with evaluation details', () => {
              expect(
                client.getBooleanValue('detailed.variation', {
                  default: true,
                  shouldTrackExposureEvent: false,
                }),
              ).toBe(true);

              assertExposureSent(ExposureTriggerReason.AutoExposure, {
                flagKey: 'detailed.variation',
                reason: 'ERROR',
                ruleId: '222-ccccc-ddd',
                value: true,
                errorKind: 'WRONG_TYPE',
              });
            });

            test('should send automatic exposure event with errorKind:WRONG_TYPE if type of default value does not match type of flag value for simple flag', () => {
              expect(
                client.getBooleanValue('variation', {
                  default: true,
                  shouldTrackExposureEvent: false,
                }),
              ).toBe(true);

              assertExposureSent(ExposureTriggerReason.AutoExposure, {
                flagKey: 'variation',
                reason: 'ERROR',
                value: true,
                errorKind: 'WRONG_TYPE',
              });
            });
          });

          describe('Flag does not exist', () => {
            test('should send automatic exposure event with errorKind:FLAG_NOT_FOUND if a flag is requested but does not exist', () => {
              expect(
                client.getBooleanValue('missing.flag', {
                  default: true,
                  shouldTrackExposureEvent: false,
                }),
              ).toBe(true);

              assertExposureSent(ExposureTriggerReason.AutoExposure, {
                flagKey: 'missing.flag',
                reason: 'ERROR',
                value: true,
                errorKind: 'FLAG_NOT_FOUND',
              });
            });
          });

          test('with automode true, shouldTrackExposureEvent true and a simple flag; should not fire automatic exposure event and track event on flag', () => {
            expect(
              client.getBooleanValue('simple.flag', {
                default: true,
                shouldTrackExposureEvent: true,
              }),
            ).toBe(false);

            assertExposureSent(ExposureTriggerReason.OptIn, {
              flagKey: 'simple.flag',
              reason: 'SIMPLE_EVAL',
              value: false,
            });
          });
        });

        describe('getVariantValue', () => {
          describe('Variant does not exist in the provided oneOf argument', () => {
            test('should send automatic exposure event with errorKind:VALIDATION_ERROR if the value does not exist in the provided oneOf for flag with evaluation details', () => {
              expect(
                client.getVariantValue('detailed.variation', {
                  default: 'not-valid-1',
                  oneOf: ['not-valid-1', 'not-valid-2'],
                  shouldTrackExposureEvent: false,
                }),
              ).toBe('not-valid-1');

              assertExposureSent(ExposureTriggerReason.AutoExposure, {
                flagKey: 'detailed.variation',
                reason: 'ERROR',
                ruleId: '222-ccccc-ddd',
                value: 'not-valid-1',
                errorKind: 'VALIDATION_ERROR',
              });
            });

            test('should send automatic exposure event with errorKind:VALIDATION_ERROR if the value does not exist in the provided oneOf for simple flag', () => {
              expect(
                client.getVariantValue('detailed.variation', {
                  default: 'not-valid-1',
                  oneOf: ['not-valid-1', 'not-valid-2'],
                  shouldTrackExposureEvent: false,
                }),
              ).toBe('not-valid-1');

              assertExposureSent(ExposureTriggerReason.AutoExposure, {
                flagKey: 'detailed.variation',
                reason: 'ERROR',
                ruleId: '222-ccccc-ddd',
                value: 'not-valid-1',
                errorKind: 'VALIDATION_ERROR',
              });
            });
          });
        });
      });
    });

    describe('Manual Exposures Mode', () => {
      test('should send exposure event with appropriate fields when trackExposure is called', async () => {
        await client.trackExposure(
          'detailed.variation',
          {
            value: '111-bbbbbb-ccc',
            explanation: {
              kind: 'RULE_MATCH',
              ruleId: 'aaaa-vbbbb-ccccc',
            },
          },
          {
            someCustomAttribute: 9000,
          },
        );

        assertCustomExposureSent(
          {
            flagKey: 'detailed.variation',
            value: '111-bbbbbb-ccc',
            reason: 'RULE_MATCH',
            ruleId: 'aaaa-vbbbb-ccccc',
          },
          { someCustomAttribute: 9000 },
          ExposureTriggerReason.Manual,
        );
      });
    });

    describe('trackFeatureFlag', () => {
      beforeEach(() => {
        client.setIsAutomaticExposuresEnabled(false);
      });
      test('should call _trackExposure and retrieve flagValue and flagExplanation from the flags map', async () => {
        client.trackFeatureFlag('detailed.variation', {
          triggerReason: ExposureTriggerReason.Manual,
        });

        expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: '222-ccccc-ddd',
            value: 'control',
          },
          tags: ['measurement', 'manualExposure'],
          highPriority: false,
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should call _trackExposure and use values for flagValue and flagExplanation from the parameters', async () => {
        client.trackFeatureFlag('detailed.variation', {
          triggerReason: ExposureTriggerReason.Manual,
          value: '222-cccccc-ddd',
          explanation: { kind: 'RULE_MATCH', ruleId: 'some-rule-id' },
        });

        expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: 'some-rule-id',
            value: '222-cccccc-ddd',
          },
          tags: ['measurement', 'manualExposure'],
          highPriority: false,
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should call sendAutomaticExposure and retrieve flagValue and flagExplanation from the flags map', async () => {
        client.setIsAutomaticExposuresEnabled(true);
        client.trackFeatureFlag('detailed.variation', {
          triggerReason: ExposureTriggerReason.AutoExposure,
        });

        expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: '222-ccccc-ddd',
            value: 'control',
          },
          tags: ['measurement', 'autoExposure'],
          highPriority: false,
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should call sendAutomaticExposure use values for flagValue and flagExplanation from the paramaters', async () => {
        client.setIsAutomaticExposuresEnabled(true);
        client.trackFeatureFlag('detailed.variation', {
          triggerReason: ExposureTriggerReason.AutoExposure,
          value: '222-cccccc-ddd',
          explanation: { kind: 'RULE_MATCH', ruleId: 'some-rule-id' },
        });

        expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: 'some-rule-id',
            value: '222-cccccc-ddd',
          },
          tags: ['measurement', 'autoExposure'],
          highPriority: false,
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should not proceed if there is no retrievable flagValue for a flagKey', async () => {
        client.trackFeatureFlag('missing.flag', {
          triggerReason: ExposureTriggerReason.AutoExposure,
        });

        expect(analyticsHandler.sendOperationalEvent).toBeCalledTimes(0);
      });

      const callTrackFeatureFlagWithoutFlagData = (flags: {
        [flagKey: string]: FlagShape;
      }) => {
        Object.keys(flags).forEach((key) =>
          client.trackFeatureFlag(key, {
            triggerReason: ExposureTriggerReason.AutoExposure,
          }),
        );
      };

      const callTrackFeatureFlagWithFlagData = (flags: {
        [flagKey: string]: FlagShape;
      }) => {
        Object.entries(flags).forEach(([key, { value, explanation }]) =>
          client.trackFeatureFlag(key, {
            triggerReason: ExposureTriggerReason.AutoExposure,
            value,
            explanation,
          }),
        );
      };

      const triggerAutomaticExposureAndAssert = (
        flags: { [flagKey: string]: FlagShape },
        triggerExposures: (flags: { [flagKey: string]: FlagShape }) => void,
      ) => {
        client.setIsAutomaticExposuresEnabled(true);
        const sendAutomaticExposureSpy = jest.spyOn(
          client,
          // @ts-ignore Spying on private function
          'sendAutomaticExposure',
        );

        triggerExposures(flags);

        expect(sendAutomaticExposureSpy).toHaveBeenCalledTimes(
          Object.keys(flags).length,
        );
        Object.entries(flags).forEach(([key, { value, explanation }]) =>
          expect(sendAutomaticExposureSpy).toHaveBeenCalledWith(
            key,
            value,
            explanation,
          ),
        );
      };

      const flasey_flags: { [flagKey: string]: FlagShape } = {
        null: defaultFlags.null,
        undefined: defaultFlags.undefined,
        zero: defaultFlags.zero,
      };

      test('should call sendAutomaticExposure when flagValue from flags if falsey', async () => {
        triggerAutomaticExposureAndAssert(
          flasey_flags,
          callTrackFeatureFlagWithoutFlagData,
        );
      });

      test('should call sendAutomaticExposure when flagValue from options if falsey', async () => {
        triggerAutomaticExposureAndAssert(
          flasey_flags,
          callTrackFeatureFlagWithFlagData,
        );
      });

      test('should not call sendAutomaticExposure when flagValue is not set', async () => {
        const sendAutomaticExposureSpy = jest.spyOn(
          client,
          // @ts-ignore Spying on private function
          'sendAutomaticExposure',
        );

        client.trackFeatureFlag('non-existant-key', {
          triggerReason: ExposureTriggerReason.AutoExposure,
        });

        expect(sendAutomaticExposureSpy).not.toHaveBeenCalled();
      });

      test('should default to a manual exposure trigger if no trigger reason is supplied', async () => {
        client.trackFeatureFlag('detailed.variation', {});

        expect(analyticsHandler.sendOperationalEvent).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'detailed.variation',
            reason: 'RULE_MATCH',
            ruleId: '222-ccccc-ddd',
            value: 'control',
          },
          tags: ['measurement', 'manualExposure'],
          highPriority: false,
          source: '@atlaskit/feature-flag-client',
        });
      });
    });
  });
});
