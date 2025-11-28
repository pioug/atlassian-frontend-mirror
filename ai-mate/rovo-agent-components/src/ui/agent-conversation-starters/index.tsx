import React, { useMemo } from 'react';

import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import RetryIcon from '@atlaskit/icon/core/retry';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AgentChatIcon } from '../../common/ui/agent-chat-icon';
import { BrowseAgentsPill, ChatPill } from '../../common/ui/chat-pill';

import { messages } from './messages';

const styles = cssMap({
	conversationStartersList: {
		listStyle: 'none',
		padding: 0,
	},
	// TODO: merge with conversationStartersList when rovo_agent_empty_state_refresh is cleaned up
	conversationStartersListRefresh: {
		width: '100%',
	},
	conversationStarterIcon: {
		flexShrink: 0,
	},
	conversationStarterText: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		minWidth: '0px',
	},
	button: {
		color: token('color.text.subtle'),
		paddingTop: token('space.075'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium', '500'),
		borderRadius: token('radius.small'),
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexShrink: 1,
		width: '100%',
		backgroundColor: token('color.background.neutral.subtle'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
});

export type ConversationStarter = { message: string; type: ConversationStarterType };

type ConversationStarterType = 'static' | 'user-defined' | 'llm-generated';

type GetConversationStartersParams = {
	userDefinedConversationStarters?: ConversationStarter[] | null | undefined;
	isAgentDefault: boolean;
};

export type StaticAgentConversationStarter = {
	message: MessageDescriptor;
	type: ConversationStarterType;
};

type ConversationStarters = {
	userDefinedConversationStarters: ConversationStarter[];
	customAgentConversationStarters: StaticAgentConversationStarter[];
	defaultAgentConversationStarters: StaticAgentConversationStarter[];
	combinedConversationStarters: Array<ConversationStarter | StaticAgentConversationStarter>;
};

export const getConversationStarters = ({
	userDefinedConversationStarters: userDefinedConversationStartersParam,
	isAgentDefault,
}: GetConversationStartersParams): ConversationStarters => {
	const type = 'static';
	const customAgentConversationStarters: StaticAgentConversationStarter[] = [
		{ message: messages.agentEmptyStateSuggestion1, type },
		{ message: messages.agentEmptyStateSuggestion2, type },
		{ message: messages.agentEmptyStateSuggestion3, type },
	];

	const userDefinedConversationStarters = userDefinedConversationStartersParam ?? [];

	const defaultAgentConversationStarters: StaticAgentConversationStarter[] = [
		{ message: messages.emptyStateSuggestion1, type },
		{ message: messages.emptyStateSuggestion2, type },
		{ message: messages.emptyStateSuggestion3, type },
	];

	const getCombinedConversationStarters = () => {
		const shouldCombine = !isAgentDefault;

		if (shouldCombine) {
			// Return user defined suggestions + static fallback suggestions with a max of 3 suggestions (user defined taking precendence over fallback)
			return [...userDefinedConversationStarters, ...customAgentConversationStarters].slice(0, 3);
		}

		return defaultAgentConversationStarters;
	};

	return {
		userDefinedConversationStarters,
		customAgentConversationStarters,
		defaultAgentConversationStarters,
		combinedConversationStarters: getCombinedConversationStarters(),
	};
};

export type AgentConversationStartersProps = {
	userDefinedConversationStarters?: GetConversationStartersParams['userDefinedConversationStarters'];
	isAgentDefault: GetConversationStartersParams['isAgentDefault'];
} & Omit<ConversationStartersProps, 'starters'>;

export const AgentConversationStarters = ({
	userDefinedConversationStarters,
	isAgentDefault,
	...props
}: AgentConversationStartersProps) => {
	const { formatMessage } = useIntl();
	const { combinedConversationStarters } = useMemo(
		() => getConversationStarters({ userDefinedConversationStarters, isAgentDefault }),
		[userDefinedConversationStarters, isAgentDefault],
	);

	const starters = useMemo(
		() =>
			combinedConversationStarters.map((starter) =>
				typeof starter.message === 'string'
					? { message: starter.message, type: starter.type }
					: { message: formatMessage(starter.message), type: starter.type },
			),
		[combinedConversationStarters, formatMessage],
	);

	return <ConversationStarters starters={starters} {...props} />;
};

export type ConversationStartersProps = {
	starters: ConversationStarter[];
	onConversationStarterClick: (conversationStarter: ConversationStarter) => void;
	showReloadButton?: boolean;
	onReloadButtonClick?: () => void;
	onBrowseAgentsClick?: () => void;
};

export const ConversationStarters = ({
	starters,
	onConversationStarterClick,
	showReloadButton = false,
	onReloadButtonClick = () => {},
	onBrowseAgentsClick,
}: ConversationStartersProps) => {
	return (
		<Stack
			as="ul"
			space="space.050"
			xcss={cx(
				styles.conversationStartersList,
				fg('rovo_agent_empty_state_refresh') && styles.conversationStartersListRefresh,
			)}
		>
			{starters.map((starter, index) => {
				const isLastStarter = index === starters.length - 1;

				const chatPill = (
					<Box as="li" key={starter.message}>
						{fg('rovo_agent_empty_state_refresh') ? (
							<Pressable xcss={styles.button} onClick={() => onConversationStarterClick(starter)}>
								<Inline space="space.150" alignBlock="center">
									<Box xcss={styles.conversationStarterIcon}>
										<AgentChatIcon />
									</Box>
									<Box xcss={styles.conversationStarterText}>{starter.message}</Box>
								</Inline>
							</Pressable>
						) : (
							<ChatPill
								testId="conversation-starter"
								key={starter.message}
								onClick={() => onConversationStarterClick(starter)}
							>
								{starter.message}
							</ChatPill>
						)}
					</Box>
				);

				return isLastStarter && showReloadButton ? (
					<Inline space="space.050" grow="fill" alignInline="end" key={starter.message}>
						{chatPill}
						<IconButton
							icon={RetryIcon}
							onClick={onReloadButtonClick}
							appearance="subtle"
							label=""
						/>
					</Inline>
				) : (
					chatPill
				);
			})}

			{!!onBrowseAgentsClick && (
				<Box as="li">
					<BrowseAgentsPill onClick={onBrowseAgentsClick} />
				</Box>
			)}
		</Stack>
	);
};
