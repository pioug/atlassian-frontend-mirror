import { StoreApi, useStore } from 'zustand';

import type { Store } from '@atlaskit/media-state';

import { useMediaClient } from './MediaClientProvider';

type ExtractState<S> = S extends { getState: () => infer X } ? X : never;

const createBoundedUseStore = (store => (selector, equals) =>
  useStore(store, selector as never, equals)) as <S extends StoreApi<unknown>>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(
    selector: (state: ExtractState<S>) => T,
    equals?: (a: T, b: T) => boolean,
  ): T;
};

export function useMediaStore<T>(
  selector: (state: Store) => T,
  equals?: (a: T, b: T) => boolean,
) {
  const mediaClient = useMediaClient();
  const store = mediaClient.__DO_NOT_USE__getMediaStore();
  const useBoundStore = createBoundedUseStore(store);
  return useBoundStore(selector, equals);
}
