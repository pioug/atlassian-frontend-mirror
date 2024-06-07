import { normalizeUrl } from '@atlaskit/linking-common/url';

import { type LinkPickerState, type LinkSearchListItemData } from '../../../common/types';

export const checkSubmitDisabled = (
	isLoading: boolean,
	isSubmitting: boolean,
	error: unknown | null,
	url: string,
	queryState: LinkPickerState | null,
	items: LinkSearchListItemData[] | null,
): boolean => {
	/*
	 * Enable insert when search term is a valid url and it can be normalized
	 * Need to explicitly enable it here otherwise next condition could meet
	 *
	 * This should effectively be the validation function for the form, ie if the form
	 * could be submitted, then it should not be disabled
	 */
	if (isSubmitting) {
		return true;
	}
	if (url && normalizeUrl(url)) {
		return false;
	}

	/*
	 * Disable insert button when plugin returns no results,
	 * but not if it is a valid url
	 */
	if (queryState && items?.length === 0) {
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
