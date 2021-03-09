import { normalizeFeatureFlags } from '../../normalize-feature-flags';

describe('mapFeatureFlagsProp', () => {
  it('returns empty object for undefined', () => {
    expect(normalizeFeatureFlags()).toEqual({});
  });

  it('returns empty object for empty object', () => {
    expect(normalizeFeatureFlags({})).toEqual({});
  });

  it('filters uppercase', () => {
    expect(
      normalizeFeatureFlags({
        A: true,
      }),
    ).toEqual({});
  });

  it('filters non-kebab case', () => {
    expect(
      normalizeFeatureFlags({
        'kebab-case': true,
        camelCase: true,
        PascalCase: true,
        snake_case: true,
      }),
    ).toEqual({
      kebabCase: true,
    });
  });

  it('filters -', () => {
    expect(normalizeFeatureFlags({ '-': true })).toEqual({});
  });

  it('filters non-boolean values', () => {
    expect(
      normalizeFeatureFlags({ boolean: true, string: 'string', number: 1 }),
    ).toEqual({ boolean: true });
  });
});
