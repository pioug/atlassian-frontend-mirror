import React, { useCallback, useEffect } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { Box, Stack, xcss } from '@atlaskit/primitives';
import {
	AgentAvatar,
	AgentBanner,
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
} from '@atlaskit/rovo-agent-components';

import {
	type AgentActionsType,
	type ProfileCardErrorType,
	type RovoAgentProfileCardInfo,
} from '../../types';
import { fireEvent, profileCardRendered } from '../../util/analytics';
import { LoadingState } from '../common/LoadingState';
import { ErrorMessage } from '../Error';

import { AgentActions } from './Actions';
import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';
import { ConversationStarters } from './ConversationStarters';
import { useAgentUrlActions } from './hooks/useAgentActions';
import { useDeleteAgent } from './hooks/useDeleteAgent';
import { useSetFavouriteAgent } from './hooks/useSetFavouriteAgent';

const styles = xcss({ paddingBlockStart: 'space.400', paddingInline: 'space.200' });

const avatarStyles = xcss({
	position: 'absolute',
	top: 'space.300',
	left: 'space.200',
});
type AgentProfileCardProps = {
	agent?: RovoAgentProfileCardInfo;
	isLoading?: boolean;
	hasError?: boolean;
	isCreatedByViewingUser?: boolean;
	cloudId?: string;
	product?: string;
	errorType?: ProfileCardErrorType;
} & AgentActionsType;

const cardContainerStyles = xcss({
	borderRadius: 'border.radius.200',
	boxShadow: 'elevation.shadow.overlay',
	position: 'relative',
});

const AgentProfileCard = ({
	agent,
	isLoading,
	isCreatedByViewingUser,
	cloudId,
	onChatClick,
	product = 'rovo',
	hasError,
	errorType,
	onConversationStartersClick,
}: AgentProfileCardProps) => {
	const {
		onEditAgent,
		onCopyAgent,
		onDuplicateAgent,
		onOpenChat: onOpenChatFullScreecn,
		onConversationStarter,
	} = useAgentUrlActions({
		cloudId: cloudId || '',
	});

	const { isStarred, setFavourite } = useSetFavouriteAgent({
		agentId: agent?.id,
		cloudId: cloudId,
		isStarred: !!agent?.favourite,
		product,
	});

	const { deleteAgent } = useDeleteAgent({ cloudId, product });

	const { createAnalyticsEvent } = useAnalyticsEvents();

	const fireAnalytics = useCallback(
		(payload: AnalyticsEventPayload) => {
			if (createAnalyticsEvent) {
				fireEvent(createAnalyticsEvent, payload);
			}
		},
		[createAnalyticsEvent],
	);

	const handleOnDelete = async () => {
		if (agent) {
			await deleteAgent(agent.id);
		}
	};
	useEffect(() => {
		if (!isLoading && agent) {
			fireAnalytics(profileCardRendered('agent', 'content'));
		}
	}, [agent, fireAnalytics, isLoading]);

	if (isLoading) {
		return (
			<AgentProfileCardWrapper>
				<LoadingState profileType="agent" fireAnalytics={fireAnalytics} />
			</AgentProfileCardWrapper>
		);
	}

	if (hasError || !agent) {
		return (
			<AgentProfileCardWrapper>
				<ErrorMessage errorType={errorType} fireAnalytics={fireAnalytics} />
			</AgentProfileCardWrapper>
		);
	}

	return (
		<AgentProfileCardWrapper>
			<Box xcss={cardContainerStyles}>
				<AgentBanner agentId={agent.id} agentNamedId={agent.named_id} height={96} />
				<Box xcss={avatarStyles}>
					<AgentAvatar agentId={agent.id} agentNamedId={agent.named_id} size="xlarge" />
				</Box>

				<Stack space="space.100" xcss={styles}>
					<AgentProfileInfo
						agentName={agent.name}
						isStarred={isStarred}
						onStarToggle={setFavourite}
						isHidden={agent.visibility === 'PRIVATE'}
						creatorRender={
							agent.creatorInfo?.type && (
								<AgentProfileCreator
									creator={{
										type: agent.creatorInfo?.type,
										name: agent.creatorInfo?.name || '',
										profileLink: agent.creatorInfo?.profileLink || '',
									}}
									isLoading={false}
									onCreatorLinkClick={() => {}}
								/>
							)
						}
						starCountRender={<AgentStarCount starCount={agent.favourite_count} isLoading={false} />}
						agentDescription={agent.description}
					/>

					<ConversationStarters
						isAgentDefault={agent.is_default}
						userDefinedConversationStarters={agent.user_defined_conversation_starters}
						onConversationStarterClick={(conversationStarter: string) => {
							onConversationStartersClick
								? onConversationStartersClick(conversationStarter)
								: onConversationStarter({ agentId: agent.id, prompt: conversationStarter });
						}}
					/>
				</Stack>
				<AgentActions
					isAgentCreatedByCurrentUser={isCreatedByViewingUser}
					onEditAgent={() => onEditAgent(agent.id)}
					onCopyAgent={() => onCopyAgent(agent.id)}
					onDuplicateAgent={() => onDuplicateAgent(agent.id)}
					onDeleteAgent={handleOnDelete}
					onChatClick={() => (onChatClick ? onChatClick() : onOpenChatFullScreecn())}
				/>
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
