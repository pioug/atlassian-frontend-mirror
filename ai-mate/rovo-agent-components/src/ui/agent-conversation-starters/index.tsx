import React, { useMemo } from 'react';

import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import RetryIcon from '@atlaskit/icon/core/retry';
import { Box, Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AgentChatIcon } from '../../common/ui/agent-chat-icon';
import { BrowseAgentsPill } from '../../common/ui/chat-pill';

import { messages } from './messages';

const styles = cssMap({
	conversationStartersList: {
		listStyle: 'none',
		padding: 0,
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
		fontWeight: token('font.weight.medium'),
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
}: AgentConversationStartersProps): React.JSX.Element => {
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
}: ConversationStartersProps): React.JSX.Element => {
	return (
		<Stack as="ul" space="space.050" xcss={styles.conversationStartersList}>
			{starters.map((starter, index) => {
				const isLastStarter = index === starters.length - 1;

				const chatPill = (
					<Box as="li" key={starter.message}>
						<Pressable
							xcss={styles.button}
							onClick={() => onConversationStarterClick(starter)}
							testId="conversation-starter"
						>
							<Inline space="space.150" alignBlock="center">
								<Box xcss={styles.conversationStarterIcon}>
									<AgentChatIcon />
								</Box>
								<Box xcss={styles.conversationStarterText}>{starter.message}</Box>
							</Inline>
						</Pressable>
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
