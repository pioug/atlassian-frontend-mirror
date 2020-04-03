import { useSmartLinkContext } from '../context';
import { CardState } from '../types';
import { useEffect, useState } from 'react';
import { getUrl } from '../actions/helpers';

export function useSmartCardState(url: string): CardState {
  const { store } = useSmartLinkContext();
  // Initially, card state should be pending and 'empty'.
  const [state, setState] = useState<CardState>(getUrl(store, url));
  // Selector for initial and subsequent states.
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(getUrl(store, url));
    });

    return () => unsubscribe();
  }, [url, store]);
  // State for use in view components.
  return state;
}
