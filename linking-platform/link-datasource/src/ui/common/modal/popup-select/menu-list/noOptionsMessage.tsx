import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { fg } from '@atlaskit/platform-feature-flags';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';
import { SpotSearchNoResult } from '../../../../../common/ui/spot/error-state/search-no-result';
import { SEARCH_DEBOUNCE_MS } from '../constants';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const CustomNoOptionsMessage = ({ filterName }: { filterName: string }) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	/**
	 * Debounce is required because our search is debounced
	 * When we type in the input box, it does not trigger a request right away. This means, if you currently having an empty result set, and you do a search,
	 * there might be some react render cycles becuause of setting search input value where you could seen an empty UI condition triggered.
	 * To fix this, we need to wait till the search debounce period to see if the new results are emtpy or not.
	 */
	const [debouncedAnalyticsCallback] = useDebouncedCallback(() => {
		fireEvent('ui.emptyResult.shown.basicSearchDropdown', {
			filterName,
		});
	}, SEARCH_DEBOUNCE_MS);

	useEffect(debouncedAnalyticsCallback, [debouncedAnalyticsCallback]);

	const { formatMessage } = useIntl();

	return (
		<CustomSelectMessage
			icon={
				<SpotSearchNoResult
					size={'medium'}
					alt={formatMessage(asyncPopupSelectMessages.noOptionsMessage)}
				/>
			}
			message={
				fg('platform-linking-visual-refresh-sllv')
					? asyncPopupSelectMessages.noOptionsMessage
					: asyncPopupSelectMessages.noOptionsMessageOld
			}
			description={
				fg('platform-linking-visual-refresh-sllv')
					? asyncPopupSelectMessages.noOptionsDescription
					: undefined
			}
			testId={`${filterName}--no-options-message`}
		/>
	);
};

export default CustomNoOptionsMessage;
