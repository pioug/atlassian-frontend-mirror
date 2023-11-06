import React from 'react';

import { render } from '@testing-library/react';

import type { PulseProps } from './index';
import { DiscoveryPulse } from './index';

describe('DiscoveryPulse', () => {
  const localStorageKey = 'TEST_KEY';
  const localStorageKeyWithPackage =
    '@atlaskit/editor-plugin-card_' + localStorageKey;

  const defaultProps = {
    localStorageKey,
  };

  const setup = (overrideProps?: Partial<PulseProps>) =>
    render(
      <DiscoveryPulse {...defaultProps} {...overrideProps}>
        <h1>Test</h1>
      </DiscoveryPulse>,
    );

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show pulse component', () => {
    const { queryByTestId } = setup();
    expect(queryByTestId('discovery-pulse')).toBeDefined();
  });

  it.each([
    ['should', false],
    ['should', undefined],
    ['should not', true],
  ])(
    '%s show animation styles if isDiscovered is %s',
    (outcome, isDiscovered) => {
      const { queryByTestId } = setup({ isDiscovered });

      const pulse = queryByTestId('discovery-pulse');
      expect(pulse).toBeDefined();

      if (outcome === 'should') {
        expect(pulse).toHaveStyle(
          'animation: animation-1bl7clz 1.45s cubic-bezier(0.5, 0, 0, 1) 3',
        );
      } else {
        expect(pulse).not.toHaveStyle(
          'animation: animation-1bl7clz 1.45s cubic-bezier(0.5, 0, 0, 1) 3',
        );
      }
    },
  );

  it.each([0, undefined])(
    'should mark local storage key as discovered immediately as the pulse shows if timeToDiscoverInMs is %s',
    timeToDiscoverInMs => {
      const { queryByTestId } = setup({ timeToDiscoverInMs });
      expect(queryByTestId('discovery-pulse')).toBeDefined();
      expect(localStorage.getItem(localStorageKeyWithPackage)).toBe(
        JSON.stringify({ value: 'discovered' }),
      );
    },
  );

  it('should mark local storage key as discovered in 1s after the pulse starts showing if timeToDiscoverInMs is 1s', () => {
    const { queryByTestId } = setup({ timeToDiscoverInMs: 1000 });
    expect(queryByTestId('discovery-pulse')).toBeDefined();
    expect(localStorage.getItem(localStorageKeyWithPackage)).toBeNull();

    jest.advanceTimersByTime(1000);
    expect(localStorage.getItem(localStorageKeyWithPackage)).toBe(
      JSON.stringify({ value: 'discovered' }),
    );
  });

  it('should put value with expiration to local storage if localStorageKeyExpirationInMs is passed', () => {
    const { queryByTestId } = setup({ localStorageKeyExpirationInMs: 1000 });
    expect(queryByTestId('discovery-pulse')).toBeDefined();

    const localStorageValue = localStorage.getItem(localStorageKeyWithPackage);
    expect(localStorageValue).not.toBeNull();

    expect(JSON.parse(localStorageValue || '')).toMatchObject({
      value: 'discovered',
      expires: expect.any(Number),
    });
  });
});
