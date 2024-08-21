import React from 'react';

import { Box, Stack, xcss } from '@atlaskit/primitives';
import {
	AgentAvatar,
	AgentBanner,
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
} from '@atlaskit/rovo-agent-components';

import { type RovoAgentProfileCardInfo } from '../../types';
import LoadingState from '../common/LoadingState';

import { AgentActions } from './Actions';
import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';
import { ConversationStarters } from './ConversationStarters';
import { useAgentUrlActions } from './useAgentActions';
import { useSetFavouriteAgent } from './useSetFavouriteAgent';

const styles = xcss({ paddingBlockStart: 'space.400', paddingInline: 'space.200' });

const avatarStyles = xcss({
	position: 'absolute',
	top: 'space.300',
	left: 'space.200',
});
type AgentProfileCardProps = {
	agent: RovoAgentProfileCardInfo;
	isLoading?: boolean;
	hasError?: boolean;
	isCreatedByViewingUser?: boolean;
	cloudId?: string;
	onOpenChat?: (agentId: string) => void;
	product?: string;
};

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
	onOpenChat,
	product = 'rovo',
}: AgentProfileCardProps) => {
	const { onEditAgent, onCopyAgent, onDuplicateAgent } = useAgentUrlActions({
		cloudId: cloudId || '',
	});

	const { isStarred, setFavourite } = useSetFavouriteAgent({
		agentId: agent.id,
		cloudId: cloudId || '',
		isStarred: agent.favourite,
		product,
	});

	if (isLoading) {
		return (
			<AgentProfileCardWrapper>
				<LoadingState profileType="agent" />
			</AgentProfileCardWrapper>
		);
	}

	return (
		<AgentProfileCardWrapper>
			<Box xcss={cardContainerStyles}>
				<AgentBanner height={96} />
				<Box xcss={avatarStyles}>
					<AgentAvatar size="xlarge" />
				</Box>

				<Stack space="space.100" xcss={styles}>
					<AgentProfileInfo
						agentName={agent.name}
						isStarred={isStarred}
						onStarToggle={setFavourite}
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
						onConversationStarterClick={function (conversationStarter: string): void {
							throw new Error('Function not implemented.');
						}}
					/>
				</Stack>
				<AgentActions
					isAgentCreatedByCurrentUser={isCreatedByViewingUser}
					onEditAgent={() => onEditAgent(agent.id)}
					onCopyAgent={() => onCopyAgent(agent.id)}
					onDuplicateAgent={() => onDuplicateAgent(agent.id)}
					onDeleteAgent={function (): void {
						throw new Error('Function not implemented.');
					}}
					onChatClick={() => onOpenChat?.(agent.id)}
				/>
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
