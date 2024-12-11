import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { ActionName } from '../../../constants';
import { messages } from '../../../messages';
import { type CustomActionItem } from '../../FlexibleCard/components/blocks/types';

/**
 * Returns a CustomActionItem with a "Connect to <providerName>" message
 *
 * @see CustomActionItem
 * @param onAuthorize a function that will be called on the click of the button
 * @param providerName a string which is inserted into the message of the button
 */
export const AuthorizeAction = (onAuthorize: () => void, providerName?: string): CustomActionItem =>
	({
		appearance: 'primary',
		name: ActionName.CustomAction,
		content: providerName ? (
			<FormattedMessage
				{...messages.connect_unauthorised_account_action}
				values={{ context: providerName }}
			/>
		) : (
			<FormattedMessage {...messages.connect_link_account_card} />
		),
		onClick: onAuthorize,
		testId: 'smart-action-connect-account',
	}) as CustomActionItem;
