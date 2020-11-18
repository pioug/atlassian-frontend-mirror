import { useSmartCardState } from '..';
import { CardStore } from '../../types';
import CardClient from '../../../client';
import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';
import { SmartCardProvider, ProviderProps } from '../../../state';
import React from 'react';

function generateWrapper(
  providerProps?: Partial<ProviderProps>,
): RenderHookOptions<{}>['wrapper'] {
  return ({ children }) => (
    <SmartCardProvider client={new CardClient()} {...providerProps}>
      {children}
    </SmartCardProvider>
  );
}

describe('useSmartCardState()', () => {
  let mockUrl = 'some.url';

  it('correctly returns default state', () => {
    const wrapper = generateWrapper();
    const { current } = renderHook(() => useSmartCardState(mockUrl), {
      wrapper,
    }).result;
    expect(current).toEqual({
      status: 'pending',
      lastUpdatedAt: expect.anything(),
    });
  });

  it('correctly returns default state, store on context undefined', () => {
    const initialState: CardStore = {};
    const wrapper = generateWrapper({ storeOptions: { initialState } });
    const { current } = renderHook(() => useSmartCardState(mockUrl), {
      wrapper,
    }).result;

    expect(current).toEqual({
      // The timestamp 1502841600000 is Wed Aug 16 00:00:00 2017 +0000, the value of date set in
      // the global unit test mock
      // See: build/jest-config/setup-dates.js
      lastUpdatedAt: 1502841600000,
      status: 'pending',
    });
  });

  it('correctly returns state from context', () => {
    const initialState: CardStore = {
      'some.url': {
        status: 'resolved',
        lastUpdatedAt: Date.now(),
        details: {
          meta: {
            auth: [],
            visibility: 'restricted',
            access: 'granted',
            definitionId: 'd1',
          },
          data: undefined,
        },
      },
    };

    const wrapper = generateWrapper({ storeOptions: { initialState } });
    const { current } = renderHook(() => useSmartCardState(mockUrl), {
      wrapper,
    }).result;
    expect(current).toEqual(initialState['some.url']);
  });
});
