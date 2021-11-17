import React from 'react';
import { mount } from 'enzyme';
import forEach from 'lodash/forEach';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';

jest.mock('../../mediaFeatureFlag-local', () => ({
  getLocalMediaFeatureFlag: jest.fn().mockReturnValue(null),
}));

import {
  areEqualFeatureFlags,
  defaultMediaFeatureFlags,
  getMediaFeatureFlag,
  useMemoizeFeatureFlags,
  MediaFeatureFlags,
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
      getMediaFeatureFlag('captions', {
        captions: false,
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
      getMediaFeatureFlag('captions', {
        captions: false,
      }),
    ).toEqual(true);
  });

  it('should use localStorage override if available even if default exists', () => {
    asMockFunction(getLocalMediaFeatureFlag).mockReturnValue('true');
    expect(getMediaFeatureFlag('newCardExperience')).toEqual(true);
    expect(getMediaFeatureFlag('captions')).toEqual(true);
  });

  describe('areEqualFeatureFlags', () => {
    it('should return true if flags are not set in both ff objects', () => {
      expect(areEqualFeatureFlags({}, {})).toEqual(true);
    });

    it('should return true if both ff objects are undefined', () => {
      expect(areEqualFeatureFlags(undefined, undefined)).toEqual(true);
    });

    it('should return false if flags are not set in one of the ff objects', () => {
      expect(areEqualFeatureFlags({}, defaultMediaFeatureFlags)).toEqual(false);
    });

    it('should return false if one of the ff objects is undefined', () => {
      expect(areEqualFeatureFlags(undefined, defaultMediaFeatureFlags)).toEqual(
        false,
      );
    });

    it('should return true if all flags has the same values set in both ff objects', () => {
      expect(
        areEqualFeatureFlags(
          defaultMediaFeatureFlags,
          defaultMediaFeatureFlags,
        ),
      ).toEqual(true);
    });

    it('should return false if all flags has different values set in the ff objects', () => {
      const changedMediaFeatureFlags = Object.keys(
        defaultMediaFeatureFlags,
      ).reduce((acc: any, key: any) => {
        acc[key] = true;
        return acc;
      }, {});
      expect(
        areEqualFeatureFlags(
          defaultMediaFeatureFlags,
          changedMediaFeatureFlags,
        ),
      ).toEqual(false);
    });

    it('should return false if any of the flags has a different value set in the ff objects', () => {
      const randomIndex = Math.floor(
        Math.random() * Object.keys(defaultMediaFeatureFlags).length,
      );
      const changedMediaFeatureFlags = Object.keys(
        defaultMediaFeatureFlags,
      ).reduce((acc: any, key: any, i: number) => {
        acc[key] = i === randomIndex;
        return acc;
      }, {});
      expect(
        areEqualFeatureFlags(
          defaultMediaFeatureFlags,
          changedMediaFeatureFlags,
        ),
      ).toEqual(false);
    });
  });
  describe('useMemoizeFeatureFlags', () => {
    let result: MediaFeatureFlags | undefined;
    beforeEach(() => {
      result = undefined;
    });

    const SomeFunctionalComponent: React.FC<{
      featureFlags?: MediaFeatureFlags;
    }> = ({ featureFlags }) => {
      result = useMemoizeFeatureFlags(featureFlags);
      return <span>{JSON.stringify(result)}</span>;
    };

    it('should return the initial prop when called the first time', () => {
      mount(
        <SomeFunctionalComponent featureFlags={defaultMediaFeatureFlags} />,
      );
      expect(result).toBe(defaultMediaFeatureFlags);
    });

    it('should return the initial prop when next prop is equivalent', () => {
      const equivalentFlags = { ...defaultMediaFeatureFlags };
      const component = mount(
        <SomeFunctionalComponent featureFlags={defaultMediaFeatureFlags} />,
      );
      expect(result).toBe(defaultMediaFeatureFlags);
      component.setProps({ featureFlags: equivalentFlags });
      expect(result).toBe(defaultMediaFeatureFlags);
    });

    it(`should return the new prop when it's not equivalent`, () => {
      const nonEquivalentFlags = {
        ...defaultMediaFeatureFlags,
        captions: !defaultMediaFeatureFlags.captions,
      };
      const component = mount(
        <SomeFunctionalComponent featureFlags={defaultMediaFeatureFlags} />,
      );
      expect(result).toBe(defaultMediaFeatureFlags);
      component.setProps({ featureFlags: nonEquivalentFlags });
      expect(result).toBe(nonEquivalentFlags);
    });
  });
});
