import FeatureFlagClient from '../../client';
import { AnalyticsHandler } from '../../types';

describe('Feature Flag Client', () => {
  let analyticsHandler: AnalyticsHandler;
  beforeEach(() => {
    analyticsHandler = jest.fn();
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
      const client = new FeatureFlagClient({
        analyticsHandler,
        flags: {
          'my.flag': { value: false },
        },
      });

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

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(false);
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
      const client = new FeatureFlagClient({
        analyticsHandler,
        flags: {
          'my.flag': { value: false },
        },
      });

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(false);

      client.clear();

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(true);
    });
  });

  describe('getters', () => {
    describe('getBooleanValue', () => {
      test('should throw if called without default', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {},
        });
        expect(() =>
          expect(client.getBooleanValue('my.flag', {} as any)),
        ).toThrow('getBooleanValue: Missing default');
      });

      test('should return default if flag is not set', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {},
        });

        expect(client.getBooleanValue('my.flag', { default: true })).toBe(true);
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
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.string.flag': { value: 'string.value' },
            'my.variation.flag': {
              value: 'experiment',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
                ruleIndex: 1,
              },
            },
          },
        });

        expect(
          client.getBooleanValue('my.variation.flag', { default: true }),
        ).toBe(true);

        expect(
          client.getBooleanValue('my.string.flag', { default: true }),
        ).toBe(true);
      });

      test('should return the right value when the flag is boolean', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.boolean.flag': { value: false },
          },
        });

        expect(
          client.getBooleanValue('my.boolean.flag', { default: true }),
        ).toBe(false);
      });

      test('should not fire the exposure event if the flag does not contain evaluation details (short format / dark feature)', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.boolean.flag': { value: false },
          },
        });

        expect(
          client.getBooleanValue('my.boolean.flag', { default: true }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should fire the exposure event if the flag contains evaluation details (long format / feature flag)', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.detailed.boolean.flag': {
              value: false,
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
                ruleIndex: 1,
              },
            },
          },
        });

        expect(
          client.getBooleanValue('my.detailed.boolean.flag', { default: true }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(1);
        expect(analyticsHandler).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'my.detailed.boolean.flag',
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: false,
          },
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should not fire the exposure event if shouldTrackExposureEvent is false', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.detailed.boolean.flag': {
              value: false,
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            shouldTrackExposureEvent: false,
          }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should allow for extra attributes in the exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.detailed.boolean.flag': {
              value: false,
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            exposureData: {
              permissions: 'read',
              section: 'view-page',
            },
          }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(1);
        expect(analyticsHandler).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'my.detailed.boolean.flag',
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: false,
            permissions: 'read',
            section: 'view-page',
          },
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should not allow extra attributes conflicting with reserved attributes', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.detailed.boolean.flag': {
              value: false,
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        const errorMessage =
          'exposureData contains a reserved attribute. Reserved attributes are: flagKey, ruleId, reason, value';

        expect(() =>
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            exposureData: {
              value: 'special',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(() =>
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            exposureData: {
              ruleId: 'reserved-1111',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(() =>
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            exposureData: {
              flagKey: 'reserved.key',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(() =>
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            exposureData: {
              reason: 'RESERVED',
            },
          }),
        ).toThrow(new TypeError(errorMessage));

        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });
    });

    describe('getVariantValue', () => {
      test('should throw if called without default', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {},
        });

        expect(() =>
          client.getVariantValue('my.flag', {
            oneOf: ['control', 'experiment'],
          } as any),
        ).toThrow('getVariantValue: Missing default');
      });

      test('should throw if called without oneOf', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {},
        });

        expect(() =>
          client.getVariantValue('my.flag', { default: 'control' } as any),
        ).toThrow('getVariantValue: Missing oneOf');
      });

      test('should return default if flag is not set, and not fire exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {},
        });

        expect(
          client.getVariantValue('my.flag', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return default if flag does not have a value attribute', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.variation.a': {
              value: 'variation-a',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getVariantValue('my.flag', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return default if flag is boolean, and not fire exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.flag': { value: true },
          },
        });

        expect(
          client.getVariantValue('my.flag', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return default if flag is not listed as oneOf, and not fire exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.variation.a': {
              value: 'variation-a',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getVariantValue('my.variation.a', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return the right value if flag is listed as oneOf, and fire exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.experiment': {
              value: 'experiment',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getVariantValue('my.experiment', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('experiment');
        expect(analyticsHandler).toHaveBeenCalledTimes(1);
        expect(analyticsHandler).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'my.experiment',
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: 'experiment',
          },
          source: '@atlaskit/feature-flag-client',
        });
      });

      test('should return the right value if flag is listed as oneOf and is a dark feature', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.string.flag': { value: 'string.value' },
          },
        });

        expect(
          client.getVariantValue('my.string.flag', {
            default: 'string.default',
            oneOf: ['string.default', 'string.value'],
          }),
        ).toBe('string.value');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should not fire exposure event if shouldTrackExposureEvent is false', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.experiment': {
              value: 'experiment',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getVariantValue('my.experiment', {
            default: 'control',
            oneOf: ['control', 'experiment'],
            shouldTrackExposureEvent: false,
          }),
        ).toBe('experiment');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should allow for extra attributes in the exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.experiment': {
              value: 'experiment',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(
          client.getVariantValue('my.experiment', {
            default: 'control',
            oneOf: ['control', 'experiment'],
            exposureData: {
              permissions: 'read',
              container: 'space',
            },
          }),
        ).toBe('experiment');
        expect(analyticsHandler).toHaveBeenCalledTimes(1);
        expect(analyticsHandler).toHaveBeenCalledWith({
          action: 'exposed',
          actionSubject: 'feature',
          attributes: {
            flagKey: 'my.experiment',
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: 'experiment',
            permissions: 'read',
            container: 'space',
          },
          source: '@atlaskit/feature-flag-client',
        });
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

            expect(client.flags['some-flag']).toEqual({
              value: wrongValue,
            });
          });
        });
      });
    });

    describe('getJSONValue', () => {
      test('should return empty object if flag is not set, and not fire exposure event', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {},
        });

        expect(client.getJSONValue('my.empty.json.flag')).toEqual({});
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return empty object if the flag is not a json flag', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.string.flag': { value: 'string.value' },
            'my.experiment': {
              value: 'experiment',
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(client.getJSONValue('my.experiment')).toEqual({});
        expect(client.getJSONValue('my.string.flag')).toEqual({});
      });

      test('should return the object if flag is set', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.json.flag': {
              value: {
                nav: 'blue',
                footer: 'black',
              },
              explanation: {
                kind: 'RULE_MATCH',
                ruleId: '111-bbbbb-ccc',
              },
            },
          },
        });

        expect(client.getJSONValue('my.json.flag')).toEqual({
          nav: 'blue',
          footer: 'black',
        });
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should accept simple flags', () => {
        const client = new FeatureFlagClient({
          analyticsHandler,
          flags: {
            'my.json.flag': {
              value: {
                nav: 'blue',
                footer: 'black',
              },
            },
          },
        });

        expect(client.getJSONValue('my.json.flag')).toEqual({
          nav: 'blue',
          footer: 'black',
        });
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });
    });
  });
});
