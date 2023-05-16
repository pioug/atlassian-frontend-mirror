import React, { useCallback, useEffect } from 'react';
import {
  CardClient,
  SmartCardContext,
  useSmartLinkContext,
} from '@atlaskit/link-provider';
import { ACTION_RESOLVED, cardAction } from '@atlaskit/linking-common';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useSmartCardState } from '..';
import { CardState, CardStore } from '../../types';
import { SmartCardProvider, ProviderProps } from '../../../state';

function generateWrapper(providerProps?: Partial<ProviderProps>) {
  return ({ children }: { children?: React.ReactNode }) => (
    <SmartCardProvider client={new CardClient()} {...providerProps}>
      {children}
    </SmartCardProvider>
  );
}

describe('useSmartCardState()', () => {
  let mockUrl = 'some.url';

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

  it('should not trigger a re-render when the store updates the data for a URL that is not being subscribed to', async () => {
    const definitionId = 'foo';
    const someUrlState = createState(definitionId);
    const someUrl = 'some.url';
    const urlToUpdate = 'https://some-unrelated-url.example.com';

    const initialState: CardStore = {
      [someUrl]: someUrlState,
    };

    const wrapper = generateWrapper({ storeOptions: { initialState } });
    const dispatchSpy = jest.fn();

    const FetchingComponent = () => {
      const { store } = useSmartLinkContext();

      const load = useCallback(() => {
        dispatchSpy();
        store.dispatch(
          cardAction(
            ACTION_RESOLVED,
            {
              url: urlToUpdate,
            },
            createState(definitionId).details,
          ),
        );
      }, [store]);

      return <button onClick={load}>Load URL</button>;
    };

    const Component = ({
      url,
      testId,
      onRender,
    }: {
      url: string;
      testId: string;
      onRender: () => void;
    }) => {
      const state = useSmartCardState(url);
      onRender();
      return (
        <div data-testid={testId}>{state.details?.meta?.definitionId}</div>
      );
    };

    const spyA = jest.fn();
    const spyB = jest.fn();

    render(
      <>
        <Component testId="preloaded-link" url={someUrl} onRender={spyA} />
        <Component testId="link-to-load" url={urlToUpdate} onRender={spyB} />
        <FetchingComponent />
      </>,
      {
        wrapper,
      },
    );

    const componentA = screen.getByTestId('preloaded-link');
    const componentB = screen.getByTestId('link-to-load');

    // Both components will have rendered once, only one will have content
    expect(spyA).toHaveBeenCalledTimes(1);
    expect(spyB).toHaveBeenCalledTimes(1);
    expect(componentA).toHaveTextContent(definitionId);
    expect(componentB).toBeEmptyDOMElement();

    expect(dispatchSpy).not.toHaveBeenCalled();

    // Click the button to trigger the second url to load
    const loadButton = screen.getByRole('button');
    fireEvent.click(loadButton);
    expect(dispatchSpy).toHaveBeenCalled();

    // Both components will have content, but only one of them will have rendered twice
    expect(componentA).toHaveTextContent(definitionId);
    expect(componentB).toHaveTextContent(definitionId);
    expect(spyA).toHaveBeenCalledTimes(1);
    expect(spyB).toHaveBeenCalledTimes(2);
  });

  it('should allow components to subscribe to the store and be guaranteed to receive any dispatches that may have been processed in the same useEffect phase that the store was subscribed to', async () => {
    const url = 'https://atlassian.com';
    const expected = 'xyz';

    /**
     * This is a quick store factory to help simulate how redux would work
     */
    const createStore = () => {
      const listeners = new Set<() => void>();
      let state: Record<string, any> = {};

      const store = {
        getState() {
          return state;
        },
        setState() {
          state[url] = { data: null };
        },
        subscribe(listener: () => {}) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      };

      const dispatch = () => {
        state = {
          ...state,
          [url]: {
            data: expected,
          },
        };
        listeners.forEach((cb) => cb());
      };

      return {
        store,
        dispatch,
      };
    };

    /**
     * Create our instance of the store
     */
    const { store, dispatch } = createStore();

    /**
     * Create a hook that subscribes to the store
     * and make it dispatch to fetch data if data is not available
     */
    const useResolve = () => {
      const state = useSmartCardState('https://atlassian.com');

      useEffect(() => {
        if (!store.getState()[url]) {
          dispatch();
        }
      }, []);

      return state;
    };

    /**
     * Create a component that will subscribe to the store
     * and render some data based on the state in the store
     */
    const Component = () => {
      const state = useResolve();
      return <div>{(state as any)?.data}</div>;
    };

    /**
     * Render two components side-by-side that will both
     * subscribe to the store and fetch the data if its not available
     *
     * If everything works as intended, then both components content should be in sync every render
     *
     * If however, things don't work correctly, component B may subscribe to the store AFTER
     * component A has already dispatched to the store to update. In this case component B will
     * have subscribe too late to receive an update.
     */
    render(
      <>
        <Component />
        <Component />
      </>,
      {
        wrapper: ({ children }) => (
          <SmartCardContext.Provider
            value={
              {
                store,
              } as any
            }
          >
            {children}
          </SmartCardContext.Provider>
        ),
      },
    );

    const [elementA, elementB] = screen.getAllByText(expected);
    /**
     * If everything works as intended, then both components content should be in sync every render
     */
    expect(elementA).toHaveTextContent(expected);
    expect(elementA).toStrictEqual(elementB);
  });
});
