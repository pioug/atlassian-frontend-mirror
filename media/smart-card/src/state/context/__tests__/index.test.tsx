import { useSmartLinkContext } from '..';
import CardClient from '../../../client';
import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';
import { SmartCardProvider } from '../../../state';
import React from 'react';

describe('useSmartCardContext()', () => {
  it('throws if required context not present', () => {
    const expectedError = new Error(
      'useSmartCard() must be wrapped in <SmartCardProvider>',
    );
    const { error } = renderHook(() => useSmartLinkContext()).result;
    expect(error).toEqual(expectedError);
  });

  it('provides correct context to consumers', () => {
    const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
      <SmartCardProvider client={new CardClient()}>
        {children}
      </SmartCardProvider>
    );

    const { current } = renderHook(() => useSmartLinkContext(), {
      wrapper,
    }).result;

    expect(current).toEqual(
      expect.objectContaining({
        config: {
          maxAge: 60000,
          maxLoadingDelay: 1200,
          authFlow: 'oauth2',
        },
        connections: {
          client: new CardClient(),
        },
      }),
    );
  });

  it('provides renderers to consumer', () => {
    const renderersParams = {
      renderers: {
        emoji: (emoji?: string) => <div />,
        adf: (adf?: string) => <div />,
      },
    };

    const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
      <SmartCardProvider client={new CardClient()} {...renderersParams}>
        {children}
      </SmartCardProvider>
    );

    const { current } = renderHook(() => useSmartLinkContext(), {
      wrapper,
    }).result;

    expect(current).toEqual(expect.objectContaining(renderersParams));
  });
});
