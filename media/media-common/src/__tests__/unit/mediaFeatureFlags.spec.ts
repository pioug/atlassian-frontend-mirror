import forEach from 'lodash/forEach';
const mockGetLocalMediaFeatureFlag = jest.fn().mockReturnValue(null);

jest.mock('../../mediaFeatureFlag-local', () => ({
  getLocalMediaFeatureFlag: mockGetLocalMediaFeatureFlag,
}));

import {
  defaultMediaFeatureFlags,
  getMediaFeatureFlag,
} from '../../mediaFeatureFlags';

describe('Media Feature Flags', () => {
  describe('shoud return default if no value passed', () => {
    forEach(defaultMediaFeatureFlags, (value, key: any) => {
      it(key, () => {
        expect(getMediaFeatureFlag(key)).toEqual(value);
        expect(getMediaFeatureFlag(key, {})).toEqual(value);
      });
    });
  });

  it('should return consumer value if passed through', () => {
    expect(
      getMediaFeatureFlag('newCardExperience', {
        newCardExperience: true,
      }),
    ).toEqual(true);
    expect(
      getMediaFeatureFlag('newCardExperience', {
        newCardExperience: false,
      }),
    ).toEqual(false);
    expect(
      getMediaFeatureFlag('zipPreviews', {
        zipPreviews: false,
      }),
    ).toEqual(false);
  });

  it('should use localStorage override if available even if flags passed', () => {
    mockGetLocalMediaFeatureFlag.mockReturnValue('true');
    expect(
      getMediaFeatureFlag('newCardExperience', {
        newCardExperience: false,
      }),
    ).toEqual(true);
    expect(
      getMediaFeatureFlag('zipPreviews', {
        zipPreviews: false,
      }),
    ).toEqual(true);
  });

  it('should use localStorage override if available even if default exists', () => {
    mockGetLocalMediaFeatureFlag.mockReturnValue('true');
    expect(getMediaFeatureFlag('newCardExperience')).toEqual(true);
    expect(getMediaFeatureFlag('zipPreviews')).toEqual(true);
  });
});
