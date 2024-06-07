import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { type CustomActionItem } from '../../../FlexibleCard/components/blocks/types';
import { ActionName } from '../../../../constants';
import { messages } from '../../../../messages';

/**
 * Returns a CustomActionItem with a "Retry" default message
 *
 * @see CustomActionItem
 * @param onRetry a function that will be called on the click of the "Retry" button
 */
export const RetryAction = (onRetry: () => void): CustomActionItem =>
	({
		name: ActionName.CustomAction,
		onClick: onRetry,
		content: <FormattedMessage {...messages.try_again} />,
		testId: 'smart-action-try-again',
	}) as CustomActionItem;
