import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { fg } from '@atlaskit/platform-feature-flags';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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

const noop = () => '';

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

	const { formatMessage } = fg('bandicoots-update-sllv-icons')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useIntl()
		: { formatMessage: noop };

	return (
		<CustomSelectMessage
			icon={
				fg('bandicoots-update-sllv-icons') ? (
					<SpotError size={'medium'} alt={formatMessage(asyncPopupSelectMessages.errorMessage)} />
				) : (
					<>
						{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons */}
						<ErrorIcon primaryColor={token('color.icon', N500)} label="" size="xlarge" />
					</>
				)
			}
			message={asyncPopupSelectMessages.errorMessage}
			testId={`${filterName}--error-message`}
		/>
	);
};

export default CustomErrorMessage;
