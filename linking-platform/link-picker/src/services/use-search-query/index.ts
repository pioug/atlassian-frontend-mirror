import { useRef } from 'react';
import { LinkPickerState } from '../../ui/types';
import { PickerState } from '../../ui/link-picker';
import { isSafeUrl } from '../../ui/link-picker/url';

export function useSearchQuery(state: PickerState) {
  const queryState = useRef<LinkPickerState | null>(null);

  /*
   * When state contains a valid url AND is NOT selected from results
   * queryState should be null to clear the items in plugin state
   */
  if (isSafeUrl(state.url) && state.selectedIndex === -1) {
    queryState.current = null;
  }

  /*
   * When state contains a search term e.g. Not a valid url return a query
   */
  if (queryState.current?.query !== state.url && !isSafeUrl(state.url)) {
    queryState.current = { query: state.url };
  }

  /*
   * When state contains a valid url and is selected from the list
   * return current state to prevent triger a new plugin search
   */
  return queryState.current;
}
