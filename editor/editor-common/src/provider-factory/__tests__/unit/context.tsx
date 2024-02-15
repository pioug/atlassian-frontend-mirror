import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';

import { ProviderFactoryProvider, useProvider } from '../../context';
import type { MediaProvider } from '../../media-provider';
import ProviderFactory from '../../provider-factory';

describe('useProvider', () => {
  let providerFactory: ProviderFactory;

  afterEach(() => {
    if (providerFactory) {
      providerFactory.destroy();
    }
  });

  it('should return media provider after been set', async () => {
    const mediaProvider = {} as MediaProvider;
    providerFactory = new ProviderFactory();

    const { result } = renderHook(() => useProvider('mediaProvider'), {
      wrapper: ({ children }) => (
        <ProviderFactoryProvider value={providerFactory}>
          {children}
        </ProviderFactoryProvider>
      ),
    });

    expect(result.current).toBeUndefined();

    act(() => {
      providerFactory.setProvider(
        'mediaProvider',
        Promise.resolve(mediaProvider),
      );
    });

    expect(result.current).resolves.toBe(mediaProvider);
  });

  it('should unsubscribe when unmount ', () => {
    const mediaProvider = {} as MediaProvider;
    providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'mediaProvider',
      Promise.resolve(mediaProvider),
    );

    const unsubscribeSpy = jest.spyOn(providerFactory, 'unsubscribe');

    const { unmount } = renderHook(() => useProvider('mediaProvider'), {
      wrapper: ({ children }) => (
        <ProviderFactoryProvider value={providerFactory}>
          {children}
        </ProviderFactoryProvider>
      ),
    });

    expect(unsubscribeSpy).not.toHaveBeenCalled();

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalledWith(
      'mediaProvider',
      expect.any(Function),
    );
  });

  it('should return media provider when already exist', async () => {
    const mediaProvider = {} as MediaProvider;
    providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'mediaProvider',
      Promise.resolve(mediaProvider),
    );

    const { result } = renderHook(() => useProvider('mediaProvider'), {
      wrapper: ({ children }) => (
        <ProviderFactoryProvider value={providerFactory}>
          {children}
        </ProviderFactoryProvider>
      ),
    });

    expect(result.current).resolves.toBe(mediaProvider);
  });
});
