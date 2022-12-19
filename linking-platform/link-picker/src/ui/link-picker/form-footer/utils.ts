import { LinkPickerState, LinkSearchListItemData } from '../../types';
import { normalizeUrl } from '../../../common/utils/url';

export const checkSubmitDisabled = (
  isLoading: boolean,
  error: unknown | null,
  state: LinkPickerState | null,
  items: LinkSearchListItemData[] | null,
): boolean => {
  /*
   * Enable insert when search term is a valid url and it can be normalized
   * Need to explicitly enable it here otherwise next condition could meet
   */
  if (state && normalizeUrl(state.query)) {
    return false;
  }

  /*
   * Disable insert button when plugin returns no results,
   * but not if it is a valid url
   */
  if (state && items?.length === 0) {
    return true;
  }

  /*
   * Disable insert button when is plugin is loading or
   * for any search error
   */
  if (isLoading || error) {
    return true;
  }

  return false;
};
