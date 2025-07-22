import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';
import { type ErrorShownBasicSearchDropdownAttributesType } from '../../../../../analytics/generated/analytics.types';
import { SpotError } from '../../../../../common/ui/spot/error-state/error';
import { SEARCH_DEBOUNCE_MS } from '../constants';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const getErrorReasonType = (
	errors?: unknown[],
): ErrorShownBasicSearchDropdownAttributesType['reason'] => {
	const [error] = errors || [];

	if (error instanceof Error) {
		return 'network';
	}

	if (errors && errors.length > 0) {
		return 'agg';
	}

	return 'unknown';
};

const CustomErrorMessage = ({ filterName, errors }: { filterName: string; errors?: unknown[] }) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	/**
	 * Debounce is required because our search is debounced
	 * ref: ./noOptionsMessage.tsx
	 */
	const [debouncedAnalyticsCallback] = useDebouncedCallback(() => {
		fireEvent('ui.error.shown.basicSearchDropdown', {
			filterName,
			reason: getErrorReasonType(errors),
		});
	}, SEARCH_DEBOUNCE_MS);

	useEffect(debouncedAnalyticsCallback, [debouncedAnalyticsCallback]);

	const { formatMessage } = useIntl();

	return (
		<CustomSelectMessage
			icon={
				<SpotError size={'medium'} alt={formatMessage(asyncPopupSelectMessages.errorMessage)} />
			}
			message={asyncPopupSelectMessages.errorMessage}
			description={asyncPopupSelectMessages.errorDescription}
			testId={`${filterName}--error-message`}
		/>
	);
};

export default CustomErrorMessage;
