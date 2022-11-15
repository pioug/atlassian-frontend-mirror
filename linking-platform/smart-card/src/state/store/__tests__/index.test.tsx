import { useSmartCardState } from '..';
import { CardState, CardStore } from '../../types';
import { CardClient } from '@atlaskit/link-provider';
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
    });
  });

  it('correctly returns default state, store on context undefined', () => {
    const initialState: CardStore = {};
    const wrapper = generateWrapper({ storeOptions: { initialState } });
    const { current } = renderHook(() => useSmartCardState(mockUrl), {
      wrapper,
    }).result;

    expect(current).toEqual({
      status: 'pending',
    });
  });

  it('correctly returns state from context', () => {
    const initialState: CardStore = {
      'some.url': {
        status: 'resolved',
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

  // This test is a courtesy of Michael Schmidt
  it('should sync with the store and return the correct state for a url if the url is changed to one that is already in the store', () => {
    const createState = (definitionId: string): CardState => ({
      status: 'resolved',
      details: {
        meta: {
          auth: [],
          visibility: 'restricted',
          access: 'granted',
          definitionId,
        },
        data: undefined,
      },
    });
    const someUrlState = createState('some-definition');
    const otherUrlState = createState('other-definition');
    const someUrl = 'some.url';
    const otherUrl = 'other.url';
    const initialState: CardStore = {
      [someUrl]: someUrlState,
      [otherUrl]: otherUrlState,
    };
    const wrapper = generateWrapper({ storeOptions: { initialState } });
    const inspect = jest.fn();
    const { result, rerender } = renderHook(
      (props: { url: string }) => {
        const state = useSmartCardState(props.url);
        inspect(props.url, state);
        return state;
      },
      {
        // @ts-ignore
        wrapper,
        initialProps: { url: someUrl },
      },
    );
    expect(result.current).toStrictEqual(someUrlState);
    // Create mock
    inspect.mockClear();
    rerender({ url: otherUrl });
    // After re-render expect to have only called inspect once with the new state that matches the url
    expect(result.current).toStrictEqual(otherUrlState);
    // Rerender will have cleaned up useEffect changes but we want to know that there was only
    // a single render caused by the changed url
    expect(inspect).toHaveBeenNthCalledWith(1, otherUrl, otherUrlState);
    expect(inspect).toHaveBeenCalledTimes(1);
  });
});
