import React from 'react';

import ChatIcon from '@atlaskit/icon/core/ai-chat';

import { ListItem } from '../../components/list-item';

import { Button } from './themed/migration';

/**
 * __Chat button__
 *
 * The chat button for the top navigation.
 * TODO: check if this is still needed and remove. Jira doesn't use it - there's a separate button for ConversationAssistant
 */
export const ChatButton = ({
	children,
	onClick,
	isSelected,
	interactionName,
}: {
	/**
	 * Text content to be rendered in the button.
	 */
	children: React.ReactNode;
	/**
	 * Handler called on click.
	 */
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	/**
	 * Indicates that the button is selected.
	 */
	isSelected?: boolean;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
}) => (
	<ListItem>
		<Button
			appearance="default"
			iconBefore={ChatIcon}
			onClick={onClick}
			isSelected={isSelected}
			interactionName={interactionName}
		>
			{children}
		</Button>
	</ListItem>
);
