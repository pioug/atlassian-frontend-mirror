import React from 'react';

import { Box, Stack, xcss } from '@atlaskit/primitives';
import {
	AgentProfileCreator,
	AgentProfileInfo,
	AgentStarCount,
} from '@atlaskit/rovo-agent-components';

import { type RovoAgentProfileCardInfo } from '../../types';
import LoadingState from '../common/LoadingState';

import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';

const styles = xcss({ paddingBlock: 'space.0', paddingInline: 'space.200' });

type AgentProfileCardProps = {
	agent: RovoAgentProfileCardInfo;
	isLoading?: boolean;
	hasError?: boolean;
};

const cardContainerStyles = xcss({
	borderRadius: 'border.radius.200',
	boxShadow: 'elevation.shadow.overlay',
});

const AgentProfileCard = ({ agent, isLoading }: AgentProfileCardProps) => {
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
				<Stack space="space.100" xcss={styles}>
					<AgentProfileInfo
						agentName={agent.name}
						isStarred={agent.favourite}
						onStarToggle={() => {}}
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
				</Stack>
			</Box>
		</AgentProfileCardWrapper>
	);
};

export default AgentProfileCard;
