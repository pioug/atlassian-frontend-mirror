import { useEffect, useState } from 'react';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { CardState, getUrl } from '@atlaskit/linking-common';

export type { CardType } from '@atlaskit/linking-common';

export function useSmartCardState(url: string): CardState {
  const { store } = useSmartLinkContext();
  // Initially, card state should be pending and 'empty'.
  const newCardState = getUrl(store, url);
  const [, setCardState] = useState<CardState>(newCardState);
  // Selector for initial and subsequent states.
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      // forcing re-renders when the store changes
      setCardState(getUrl(store, url));
    });

    return () => unsubscribe();
  }, [url, store]);

  // Returning fresh state for use in view components. Added as a part of the fix in EDM-4422.
  return newCardState;
}
