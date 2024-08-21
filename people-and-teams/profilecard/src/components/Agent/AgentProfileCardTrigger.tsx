import React, { Suspense } from 'react';

import { type AgentProfileCardTriggerProps, type RovoAgentProfileCardInfo } from '../../types';
import { getAAIDFromARI } from '../../util/rovoAgentUtils';
import ProfileCardTrigger from '../common/ProfileCardTrigger';

import { AgentProfileCardLazy } from './lazyAgentProfileCard';

export const AgentProfileCardTrigger = ({
	trigger = 'hover',
	viewingUserId,
	product,
	...props
}: AgentProfileCardTriggerProps) => {
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
				const userId = getAAIDFromARI(creator) || '';
				const creatorInfo = await props.resourceClient.getProfile(userId, cloudId || '');
				return {
					type: 'CUSTOMER' as const,
					name: creatorInfo.fullName,
					profileLink: `/people/${userId}`,
					id: userId,
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

		return (
			<Suspense fallback={null}>
				<AgentProfileCardLazy
					agent={profileData}
					isLoading={isLoading}
					isCreatedByViewingUser={profileData.creatorInfo?.id === viewingUserId}
					cloudId={props.cloudId}
					product={product}
				/>
			</Suspense>
		);
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
