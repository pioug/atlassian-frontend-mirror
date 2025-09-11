import React, { forwardRef, Suspense, useCallback } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';

import {
	type AgentProfileCardTriggerProps,
	type ProfileCardErrorType,
	type RovoAgentProfileCardInfo,
} from '../../types';
import { fireEvent } from '../../util/analytics';
import { getAAIDFromARI } from '../../util/rovoAgentUtils';
import ProfileCardTrigger, { type ProfileCardHandle } from '../common/ProfileCardTrigger';

import { AgentProfileCardLazy } from './lazyAgentProfileCard';

export const AgentProfileCardTrigger = forwardRef<ProfileCardHandle, AgentProfileCardTriggerProps>(
	({ trigger = 'hover', viewingUserId, product, ...props }, ref) => {
		const { resourceClient, agentId: userId, cloudId } = props;

		const { createAnalyticsEvent } = useAnalyticsEvents();
		const fireAnalytics = useCallback(
			(payload: AnalyticsEventPayload) => {
				if (createAnalyticsEvent) {
					fireEvent(createAnalyticsEvent, payload);
				}
			},
			[createAnalyticsEvent],
		);

		const getCreator = async (creator_type: string, creator?: string) => {
			if (!creator) {
				return undefined;
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

						const { href: profileHref } = navigateToTeamsApp({
							type: 'USER',
							payload: {
								userId: userId,
							},
							cloudId,
						});
						const creatorInfo = await props.resourceClient.getProfile(
							cloudId,
							userId,
							fireAnalytics,
						);

						return {
							type: 'CUSTOMER' as const,
							name: creatorInfo.fullName,
							profileLink: fg('platform-adopt-teams-nav-config')
								? profileHref
								: `/people/${userId}`,
							id: userId,
						};
					} catch (error) {
						return undefined;
					}

				default:
					return undefined;
			}
		};

		const fetchAgentProfile = async (): Promise<RovoAgentProfileCardInfo> => {
			const agentInfo = await resourceClient.getRovoAgentProfile(
				{ type: 'agent', value: userId },
				fireAnalytics,
			);
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
				fireAnalytics={fireAnalytics}
				profileCardType="agent"
			/>
		);
	},
);
