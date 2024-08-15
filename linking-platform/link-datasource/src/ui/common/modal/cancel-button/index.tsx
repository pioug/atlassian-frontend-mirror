/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
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

export const CancelButton = ({ getAnalyticsPayload, onCancel, testId }: CancelButtonProps) => {
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
