import React from 'react';

import { type ProfileCardTriggerProps, type RovoAgentProfileCardInfo } from '../../types';
import ProfileCardTrigger from '../common/ProfileCardTrigger';

import { AgentProfileCardLazy } from './lazyAgentProfileCard';

export const AgentProfileCardTrigger = ({
	trigger = 'hover',
	...props
}: Omit<ProfileCardTriggerProps, 'renderProfileCard'>) => {
	const { resourceClient, userId, cloudId } = props;

	const getCreator = async (creator_type: string, creator?: string) => {
		if (!creator) {
			return undefined;
		}
		switch (creator_type) {
			case 'SYSTEM':
				return { type: 'SYSTEM' as const };

			case 'THIRD_PARTY':
				return { type: 'THIRD_PARTY' as const, name: creator ?? '' };

			case 'CUSTOMER':
				const creatorInfo = await props.resourceClient.getProfile(creator, cloudId || '');
				return {
					type: 'CUSTOMER' as const,
					name: creatorInfo.fullName,
					profileLink: `/people/${creator}`,
				};

			default:
				return undefined;
		}
	};

	const fetchAgentProfile = async (): Promise<RovoAgentProfileCardInfo> => {
		const agentInfo = await resourceClient.getRovoAgentProfile(userId);
		const agentCreatorInfo = await getCreator(
			agentInfo.creator_type,
			agentInfo.creator || undefined,
		);
		return {
			...agentInfo,
			creatorInfo: agentCreatorInfo,
		};
	};
	const renderProfileCard = ({
		profileData,
		isLoading,
	}: {
		profileData?: RovoAgentProfileCardInfo;
		isLoading: boolean;
	}) => {
		if (!profileData) {
			return <></>;
		}

		return <AgentProfileCardLazy agent={profileData} isLoading={isLoading} />;
	};

	return (
		<ProfileCardTrigger
			{...props}
			renderProfileCard={renderProfileCard}
			trigger={trigger}
			fetchProfile={fetchAgentProfile}
		/>
	);
};
