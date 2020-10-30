import forEach from 'lodash/forEach';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';

jest.mock('../../mediaFeatureFlag-local', () => ({
  getLocalMediaFeatureFlag: jest.fn().mockReturnValue(null),
}));

import {
  defaultMediaFeatureFlags,
  getMediaFeatureFlag,
} from '../../mediaFeatureFlags';
import { getLocalMediaFeatureFlag } from '../../mediaFeatureFlag-local';

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
    asMockFunction(getLocalMediaFeatureFlag).mockReturnValue('true');
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
    asMockFunction(getLocalMediaFeatureFlag).mockReturnValue('true');
    expect(getMediaFeatureFlag('newCardExperience')).toEqual(true);
    expect(getMediaFeatureFlag('zipPreviews')).toEqual(true);
  });
});
