import Button from '@atlaskit/button';
import React, { type FC, useMemo } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { di } from 'react-magnetic-di';

import { messages } from '../../../../messages';
import { toMessage } from '../../../../utils/intl-utils';
import UnresolvedView from '../unresolved-view';
import { type ForbiddenViewProps } from './types';
import { getUnresolvedEmbedCardImage } from '../../utils';

const ForbiddenView: FC<ForbiddenViewProps> = ({
	context,
	onAuthorize,
	accessContext,
	testId = 'embed-card-forbidden-view',
	...unresolvedViewProps
}) => {
	const { icon, image, text = '' } = context ?? {};
	const {
		accessType,
		hostname,
		titleMessageKey,
		descriptiveMessageKey,
		callToActionMessageKey,
		action,
	} = accessContext ?? {};
	di(getUnresolvedEmbedCardImage);

	const values = useMemo(() => {
		const product = context?.text ?? '';
		return {
			context: product,
			product,
			hostname: <b>{hostname}</b>,
		};
	}, [hostname, context?.text]);

	/**
	 * if there is a request access context, but no action to perform, do not show any button.
	 * By default, a "Try another account" button shows, but with request access context, we don't
	 * want to encourage users to try another account, if their request is already pending, etc.
	 */
	const button = useMemo(() => {
		const onEmbedCardClick = action?.promise ?? onAuthorize;
		if (!onEmbedCardClick) {
			return null;
		}

		return (
			<Button
				testId={`button-${action?.id || 'connect-other-account'}`}
				appearance="primary"
				onClick={onEmbedCardClick}
				isDisabled={accessType === 'PENDING_REQUEST_EXISTS'}
			>
				<FormattedMessage
					{...toMessage(messages.try_another_account, callToActionMessageKey)}
					values={values}
				/>
			</Button>
		);
	}, [accessType, action?.id, action?.promise, callToActionMessageKey, onAuthorize, values]);

	return (
		<UnresolvedView
			{...unresolvedViewProps}
			icon={icon}
			image={image ?? getUnresolvedEmbedCardImage('forbidden')}
			testId={testId}
			text={text}
			title={
				<FormattedMessage
					{...toMessage(messages.invalid_permissions, titleMessageKey)}
					values={values}
				/>
			}
			description={
				<FormattedMessage
					{...toMessage(messages.invalid_permissions_description, descriptiveMessageKey)}
					values={values}
				/>
			}
			button={button}
		/>
	);
};

export default ForbiddenView;
