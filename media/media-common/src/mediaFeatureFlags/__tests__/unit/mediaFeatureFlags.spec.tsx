import React from 'react';
import { mount } from 'enzyme';
import { ProductKeys } from '../../types';
import * as genericFeatureFlagModule from '../../genericFeatureFlag';
import * as productKeys from '../../productKeys';
jest.mock('../../../mediaFeatureFlag-local', () => ({
  getLocalMediaFeatureFlag: jest.fn().mockReturnValue(null),
}));

jest.spyOn(productKeys, 'getProductKeys').mockImplementation(
  () =>
    ({
      confluence: {
        'my-first-flag': 'conflu-my-first-flag',
        'my-second-flag': 'conflu-my-second-flag',
        'my-third-flag': 'conflu-my-third-flag',
        'my-fourth-flag': 'conflu-my-fourth-flag',
      },
      jira: {
        'my-first-flag': 'jira-my-first-flag',
        'my-second-flag': 'jira-my-second-flag',
        'my-third-flag': 'jira-my-third-flag',
        'my-fourth-flag': 'jira-my-fourth-flag',
      },
    } as unknown as ProductKeys),
);

import {
  areEqualFeatureFlags,
  defaultMediaFeatureFlags,
  getMediaFeatureFlag,
  useMemoizeFeatureFlags,
  filterFeatureFlagNames,
  getFeatureFlagKeysAllProducts,
} from '../../mediaFeatureFlags';
import { MediaFeatureFlags, RequiredMediaFeatureFlags } from '../../types';

const getGenericFeatureFlagMock = jest
  .spyOn(genericFeatureFlagModule, 'getGenericFeatureFlag')
  .mockImplementation(() => 'some-value');

describe('Media Feature Flags', () => {
  it('calls the internal getter with the right parameters', () => {
    const consumerFlags = { someKey: 'some-consumer-value' };
    const requestedKey = 'someRequestedKey';
    const value = getMediaFeatureFlag(
      requestedKey as keyof MediaFeatureFlags,
      consumerFlags as MediaFeatureFlags,
    );
    expect(value).toBe('some-value');
    expect(getGenericFeatureFlagMock).toBeCalledWith(
      requestedKey,
      defaultMediaFeatureFlags,
      consumerFlags,
    );
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
      ).reduce<Record<string, boolean>>((acc: any, key: any) => {
        acc[key] = !(
          defaultMediaFeatureFlags as unknown as Record<string, boolean>
        )[key];
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
      ).reduce<Record<string, boolean>>((acc: any, key: string, i: number) => {
        if (i === randomIndex) {
          acc[key] = !(
            defaultMediaFeatureFlags as unknown as Record<string, boolean>
          )[key];
        } else {
          acc[key] = (
            defaultMediaFeatureFlags as unknown as Record<string, boolean>
          )[key];
        }
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
  describe('filterFeatureFlagNames', () => {
    it('returns the flag names switched on', () => {
      expect(
        filterFeatureFlagNames({
          'my-first-flag': true,
          'my-second-flag': false,
          'my-third-flag': true,
          'my-fourth-flag': false,
        } as unknown as RequiredMediaFeatureFlags),
      ).toEqual(['my-first-flag', 'my-third-flag']);
    });
  });

  describe('getFeatureFlagKeysAllProducts', () => {
    it('returns all the launch darkly flag names', () => {
      expect(getFeatureFlagKeysAllProducts()).toEqual([
        'conflu-my-first-flag',
        'conflu-my-second-flag',
        'conflu-my-third-flag',
        'conflu-my-fourth-flag',
        'jira-my-first-flag',
        'jira-my-second-flag',
        'jira-my-third-flag',
        'jira-my-fourth-flag',
      ]);
    });
  });
});
