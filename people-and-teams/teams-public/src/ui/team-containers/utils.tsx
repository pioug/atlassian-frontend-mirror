import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl-next';

import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { Flex } from '@atlaskit/primitives/compiled';

import { type FlagType } from './types';

export const getCreateContainerContactSupportFlag = (): {
	id: string;
	type: FlagType;
	title: React.JSX.Element;
	description: React.JSX.Element;
	actions: {
		content: React.JSX.Element;
		href: string;
	}[];
} => ({
	id: 'teams-public.team-container.create-container.error.contact-support',
	type: 'error' as FlagType,
	title: <FormattedMessage {...messages.noConnectionTitle} />,
	description: <FormattedMessage {...messages.noConnectionDescription} />,
	actions: [
		{
			content: (
				<Flex alignItems="center" columnGap="space.100">
					<FormattedMessage {...messages.noConnectionAction} />
					<LinkExternalIcon label="" />
				</Flex>
			),

			href: 'https://support.atlassian.com/contact/#/&support_type=customer',
		},
	],
});

export const getCreateContainerTryAgainFlag = ({
	tryAgainAction,
	containerType,
}: {
	tryAgainAction?: () => void;
	containerType: string;
}): {
	id: string;
	type: FlagType;
	title: React.JSX.Element;
	description: React.JSX.Element;
	actions: {
		content: React.JSX.Element;
		onClick: () => void;
	}[];
} => ({
	id: 'teams-public.team-container.create-container.error.try-again',
	type: 'error' as FlagType,
	title: <FormattedMessage {...messages.timeoutTitle} values={{ containerType }} />,
	description: <FormattedMessage {...messages.timeoutDescription} />,
	actions: [
		{
			content: <FormattedMessage {...messages.timeoutAction} />,
			onClick: () => {
				tryAgainAction?.();
			},
		},
	],
});

const messages = defineMessages({
	timeoutTitle: {
		id: 'teams-public.team-containers.timeout-title',
		defaultMessage: 'We’re couldn’t connect your {containerType}',
		description: 'Title for the timeout flag',
	},
	timeoutDescription: {
		id: 'teams-public.team-containers.timeout-description',
		defaultMessage: 'Something went wrong. Verify your connection and retry.',
		description: 'Description for the timeout flag',
	},
	timeoutAction: {
		id: 'teams-public.team-containers.timeout-action',
		defaultMessage: 'Try again',
		description: 'Action text for the timeout flag',
	},
	noConnectionTitle: {
		id: 'teams-public.team-containers.timeout-no-connection-title',
		defaultMessage: 'Connection failed',
		description: 'Title for the no connection flag',
	},
	noConnectionDescription: {
		id: 'teams-public.team-containers.timeout-no-connection-description',
		defaultMessage: 'Try manually creating the space yourself.',
		description: 'Description for the no connection flag',
	},
	noConnectionAction: {
		id: 'teams-public.team-containers.timeout-no-connection-action',
		defaultMessage: 'Contact support',
		description: 'Action text for the no connection flag',
	},
});
