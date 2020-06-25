import { TEST_BASE_DATA, TEST_LINK, TEST_OBJECT } from '../../__mocks__/jsonld';
import { extractPlatformIsSupported } from '../extractPlatformIsSupported';

describe('extractors.preview.platformSupported', () => {
  it('returns supported when no preview present', () => {
    expect(extractPlatformIsSupported(undefined)).toBe(false);
  });

  it('returns supported when string is passed', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = TEST_LINK;
    expect(extractPlatformIsSupported(data)).toBe(true);
  });

  it('returns supported - object present', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = TEST_OBJECT;
    expect(extractPlatformIsSupported(data)).toEqual(true);
  });

  it('returns supported - object present, platform supported', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = { ...TEST_OBJECT, 'atlassian:supportedPlatforms': ['web'] };
    expect(extractPlatformIsSupported(data, 'web')).toEqual(true);
  });

  it('returns supported - object present, platform not supported', () => {
    const data = { ...TEST_BASE_DATA };
    data.preview = {
      ...TEST_OBJECT,
      'atlassian:supportedPlatforms': ['mobile'],
    };
    expect(extractPlatformIsSupported(data, 'mobile')).toEqual(true);
  });
});
