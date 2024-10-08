import React, { useMemo } from 'react';

import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import RetryIcon from '@atlaskit/icon/core/retry';
import { Inline } from '@atlaskit/primitives';

import { BrowseAgentsPill, ChatPill } from '../../common/ui/chat-pill';

import { messages } from './messages';

type GetConversationStartersParams = {
	userDefinedConversationStarters?: string[] | null | undefined;
	isAgentDefault: boolean;
};

type ConversationStarters = {
	userDefinedConversationStarters: string[];
	customAgentConversationStarters: MessageDescriptor[];
	defaultAgentConversationStarters: MessageDescriptor[];
	combinedConversationStarters: Array<string | MessageDescriptor>;
};

export const getConversationStarters = ({
	userDefinedConversationStarters: userDefinedConversationStartersParam,
	isAgentDefault,
}: GetConversationStartersParams): ConversationStarters => {
	const customAgentConversationStarters = [
		messages.agentEmptyStateSuggestion1,
		messages.agentEmptyStateSuggestion2,
		messages.agentEmptyStateSuggestion3,
	];

	const userDefinedConversationStarters = userDefinedConversationStartersParam ?? [];

	const defaultAgentConversationStarters = [
		messages.emptyStateSuggestion1,
		messages.emptyStateSuggestion2,
		messages.emptyStateSuggestion3,
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
				typeof starter === 'string' ? starter : formatMessage(starter),
			),
		[combinedConversationStarters, formatMessage],
	);

	return <ConversationStarters starters={starters} {...props} />;
};

export type ConversationStartersProps = {
	starters: string[];
	onConversationStarterClick: (conversationStarter: string) => void;
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
		<>
			{starters.map((starter, index) => {
				const isLastStarter = index === starters.length - 1;

				const chatPill = (
					<ChatPill
						testId="conversation-starter"
						key={starter}
						onClick={() => onConversationStarterClick(starter)}
					>
						{starter}
					</ChatPill>
				);

				return isLastStarter && showReloadButton ? (
					<Inline space="space.050" grow="fill" alignInline="end" key={starter}>
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

			{!!onBrowseAgentsClick && <BrowseAgentsPill onClick={onBrowseAgentsClick} />}
		</>
	);
};
