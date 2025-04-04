import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';
import { SpotSearchNoResult } from '../../../../../common/ui/spot/error-state/search-no-result';
import { SEARCH_DEBOUNCE_MS } from '../constants';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const noop = () => '';

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

	const { formatMessage } = fg('bandicoots-update-sllv-icons')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useIntl()
		: { formatMessage: noop };

	return (
		<CustomSelectMessage
			icon={
				fg('bandicoots-update-sllv-icons') ? (
					<SpotSearchNoResult
						size={'medium'}
						alt={formatMessage(asyncPopupSelectMessages.noOptionsMessage)}
					/>
				) : (
					<>
						{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons */}
						<QuestionCircleIcon primaryColor={token('color.icon', N500)} size="xlarge" label="" />
					</>
				)
			}
			message={asyncPopupSelectMessages.noOptionsMessage}
			testId={`${filterName}--no-options-message`}
		/>
	);
};

export default CustomNoOptionsMessage;
