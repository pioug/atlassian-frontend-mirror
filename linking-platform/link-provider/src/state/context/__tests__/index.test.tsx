import { useSmartLinkContext, SmartCardProvider } from '..';
import CardClient from '../../../client';
import { renderHook, RenderHookOptions } from '@testing-library/react-hooks';
// import { SmartCardProvider } from '@atlaskit/link-provider';
import React from 'react';
import type { ProductType } from '@atlaskit/linking-common';

describe('useSmartCardContext()', () => {
  it('throws if required context not present', () => {
    const expectedError = new Error(
      'useSmartCard() must be wrapped in <SmartCardProvider>',
    );
    const { error } = renderHook(() => useSmartLinkContext()).result;
    expect(error).toEqual(expectedError);
  });

  it('provides correct context to consumers', () => {
    const client = new CardClient();
    const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
      <SmartCardProvider client={client}>{children}</SmartCardProvider>
    );

    const { current } = renderHook(() => useSmartLinkContext(), {
      wrapper,
    }).result;

    expect(current).toEqual(
      expect.objectContaining({
        config: {
          authFlow: 'oauth2',
        },
        connections: {
          client,
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

  describe('product', () => {
    it('returns undefined if not present', () => {
      const { current } = renderHook(() => useSmartLinkContext(), {
        wrapper: ({ children }) => {
          const client = new CardClient();
          return (
            <SmartCardProvider client={client}>{children}</SmartCardProvider>
          );
        },
      }).result;

      expect(current.product).toBeUndefined();
    });

    it.each<[ProductType]>([
      ['CONFLUENCE'],
      ['ATLAS'],
      ['BITBUCKET'],
      ['TRELLO'],
      ['JSW'],
      ['JWM'],
      ['JSM'],
      ['JPD'],
      ['ELEVATE'],
    ])('returns %s', (product: ProductType) => {
      const { current } = renderHook(() => useSmartLinkContext(), {
        wrapper: ({ children }) => {
          const client = new CardClient();
          return (
            <SmartCardProvider client={client} product={product}>
              {children}
            </SmartCardProvider>
          );
        },
      }).result;

      expect(current.product).toBe(product);
    });
  });
});
