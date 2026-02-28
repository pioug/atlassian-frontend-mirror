import React, { forwardRef, Suspense } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	type AgentCreatorType,
	isForgeAgentByCreatorType,
} from '@atlaskit/rovo-agent-components/ui/AgentAvatar';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';

import {
	type AgentProfileCardTriggerProps,
	type ProfileCardErrorType,
	type RovoAgentAgg,
	type RovoAgentProfileCardInfo,
} from '../../types';
import { getAAIDFromARI } from '../../util/rovoAgentUtils';
import ProfileCardTrigger, { type ProfileCardHandle } from '../common/ProfileCardTrigger';

import { AgentProfileCardLazy } from './lazyAgentProfileCard';

export const AgentProfileCardTrigger = forwardRef<ProfileCardHandle, AgentProfileCardTriggerProps>(
	({ ...props }, ref) => {
		const { resourceClient, agentId: userId, cloudId } = props;

		const { fireEvent } = useAnalyticsEvents();

		/**
		 * @TODO replace with `getAgentCreator` from `@atlassian/rovo-agent-components`
		 * @deprecated use `getAgentCreator` from `@atlassian/rovo-agent-components`
		 */
		const getCreator = async ({
			creator_type,
			creator,
			authoringTeam,
		}: {
			creator_type: string;
			creator?: string;
			authoringTeam?: RovoAgentAgg['authoringTeam'];
		}) => {
			if (!creator) {
				return undefined;
			}

			if (
				isForgeAgentByCreatorType(creator_type as AgentCreatorType) &&
				fg('rovo_agent_support_a2a_avatar')
			) {
				return { type: 'THIRD_PARTY' as const, name: creator ?? '' };
			}

			switch (creator_type) {
				case 'SYSTEM':
					return { type: 'SYSTEM' as const };

				case 'THIRD_PARTY':
					return { type: 'THIRD_PARTY' as const, name: creator ?? '' };
				case 'FORGE':
					return { type: 'THIRD_PARTY' as const, name: creator ?? '' };

				case 'CUSTOMER':
					const userId = getAAIDFromARI(creator) || '';
					try {
						if (!userId || !cloudId) {
							return undefined;
						}

						if (authoringTeam) {
							return {
								type: 'CUSTOMER' as const,
								name: authoringTeam.displayName ?? '',
								profileLink: authoringTeam.profileUrl ?? '',
							};
						}

						const { href: profileHref } = navigateToTeamsApp({
							type: 'USER',
							payload: {
								userId: userId,
							},
							cloudId,
						});
						const creatorInfo = await props.resourceClient.getProfile(cloudId, userId, fireEvent);

						return {
							type: 'CUSTOMER' as const,
							name: creatorInfo.fullName,
							profileLink: fg('platform-adopt-teams-nav-config')
								? profileHref
								: `/people/${userId}`,
							id: userId,
						};
					} catch {
						return undefined;
					}

				default:
					return undefined;
			}
		};

		const fetchAgentProfile = async (): Promise<RovoAgentProfileCardInfo> => {
			const agentProfileResult = await resourceClient.getRovoAgentProfile(
				{ type: 'agent', value: userId },
				fireEvent,
			);

			const agentInfo = agentProfileResult.restData;
			const agentCreatorInfo = await getCreator({
				creator_type: agentInfo.creator_type,
				creator: agentInfo.creator || undefined,
				authoringTeam: agentProfileResult.aggData?.authoringTeam ?? undefined,
			});
			return {
				...agentInfo,
				creatorInfo: agentCreatorInfo,
			};
		};
		const renderProfileCard = ({
			profileData,
			error,
		}: {
			profileData?: RovoAgentProfileCardInfo;
			error?: ProfileCardErrorType;
		}) => {
			return (
				<Suspense fallback={null}>
					<AgentProfileCardLazy
						agent={profileData}
						hasError={!!error}
						cloudId={props.cloudId}
						errorType={error}
						onChatClick={props.onChatClick}
						onConversationStartersClick={props.onConversationStartersClick}
						resourceClient={props.resourceClient}
						onDeleteAgent={props.onDeleteAgent}
						addFlag={props.addFlag}
					/>
				</Suspense>
			);
		};

		return (
			<ProfileCardTrigger<RovoAgentProfileCardInfo>
				{...props}
				ref={ref}
				trigger="hover"
				renderProfileCard={renderProfileCard}
				fetchProfile={fetchAgentProfile}
				fireAnalyticsNext={fireEvent}
				profileCardType="agent"
			/>
		);
	},
);
