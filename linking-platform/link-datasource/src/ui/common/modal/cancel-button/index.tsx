import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';
import { type ButtonClickedCancelAttributesType } from '../../../../analytics/generated/analytics.types';

import { cancelButtonMessages } from './messages';
export interface CancelButtonProps {
	getAnalyticsPayload: () => ButtonClickedCancelAttributesType;
	onCancel: () => void;
	testId?: string;
}

export const CancelButton = ({
	getAnalyticsPayload,
	onCancel,
	testId,
}: CancelButtonProps): React.JSX.Element => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const onCancelClick = useCallback(() => {
		fireEvent('ui.button.clicked.cancel', getAnalyticsPayload());

		onCancel();
	}, [getAnalyticsPayload, fireEvent, onCancel]);

	return (
		<Button appearance="default" onClick={onCancelClick} testId={testId}>
			<FormattedMessage {...cancelButtonMessages.cancelButtonText} />
		</Button>
	);
};
