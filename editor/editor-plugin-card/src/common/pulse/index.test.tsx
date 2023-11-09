import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { markLocalStorageKeyDiscovered } from '../local-storage';

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
    localStorage.clear();
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

  it('should mark local storage key as discovered after an iteration of pulse animation', async () => {
    const { findByTestId } = setup();
    const discoveryPulse = await findByTestId('discovery-pulse');
    expect(localStorage.getItem(localStorageKeyWithPackage)).toBeNull();

    fireEvent.animationIteration(discoveryPulse);

    expect(localStorage.getItem(localStorageKeyWithPackage)).toBe(
      JSON.stringify({ value: 'discovered' }),
    );
  });

  it('should not show animation styles if local storage is set as discovered', async () => {
    markLocalStorageKeyDiscovered(localStorageKey);
    const { findByTestId } = setup();
    const discoveryPulse = await findByTestId('discovery-pulse');
    expect(discoveryPulse).not.toHaveStyle(
      'animation: animation-1bl7clz 1.45s cubic-bezier(0.5, 0, 0, 1) 3',
    );
  });

  it('should show animation styles if local storage is not previously set as discovered', async () => {
    const { findByTestId } = setup();
    const discoveryPulse = await findByTestId('discovery-pulse');

    expect(discoveryPulse).toHaveStyle(
      'animation: animation-1bl7clz 1.45s cubic-bezier(0.5, 0, 0, 1) 3',
    );
  });
});
