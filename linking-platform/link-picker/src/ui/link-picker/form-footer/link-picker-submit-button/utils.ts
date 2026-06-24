import { normalizeUrl } from '@atlaskit/linking-common/url';
import { fg } from '@atlaskit/platform-feature-flags';

import { type LinkPickerState, type LinkSearchListItemData } from '../../../../common/types';

export const checkSubmitDisabled = (
	isLoading: boolean,
	isSubmitting: boolean,
	error: unknown | null,
	url: string,
	queryState: LinkPickerState | null,
	items: LinkSearchListItemData[] | null,
	disableManualUrlInsert?: boolean,
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
	if (fg('add-disable-manual-url-capability-technical')) {
		/*
		 * Check isLoading/error before disableManualUrlInsert so that stale items
		 * from a previous search do not accidentally enable the button during an
		 * in-flight request or an error state.
		 */
		if (isLoading || error) {
			return true;
		}

		/*
		 * When disableManualUrlInsert is true, disable insert unless a result has been
		 * selected from the list (i.e. items are present and queryState is set).
		 * This prevents the user from manually typing a URL to bypass the restriction.
		 */
		if (disableManualUrlInsert) {
			return !(queryState && items && items.length > 0);
		}
	}

	/*
	 * Enable insert when search term is a valid url and it can be normalized.
	 * Need to explicitly enable it here otherwise next condition could meet.
	 *
	 * This should effectively be the validation function for the form, ie if the form
	 * could be submitted, then it should not be disabled.
	 */
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
	 * Disable insert button when plugin is loading or for any search error.
	 * When the gate is on, this is already handled earlier in the function.
	 */
	if (!fg('add-disable-manual-url-capability-technical') && (isLoading || error)) {
		return true;
	}

	return false;
};
