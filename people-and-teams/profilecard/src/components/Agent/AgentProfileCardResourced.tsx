import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';

import {
	type AgentActionsType,
	type Flag,
	type ProfileClient,
	type RovoAgentProfileCardInfo,
	type TriggerType,
} from '../../types';
import { fireEvent } from '../../util/analytics';
import { getAAIDFromARI } from '../../util/rovoAgentUtils';
import ErrorMessage from '../Error/ErrorMessage';

import { AgentProfileCardWrapper } from './AgentProfileCardWrapper';
import { AgentProfileCardLazy } from './lazyAgentProfileCard';

export type AgentProfileCardResourcedProps = {
	accountId: string;
	cloudId: string;
	resourceClient: ProfileClient;
	trigger?: TriggerType;
	children?: React.ReactNode;
	addFlag?: (flag: Flag) => void;
	onDeleteAgent?: (agentId: string) => { restore: () => void };
	/** Hide the Agent more actions dropdown when true */
	hideMoreActions?: boolean;
} & AgentActionsType;

export const AgentProfileCardResourced = (props: AgentProfileCardResourcedProps) => {
	const [agentData, setAgentData] = useState<RovoAgentProfileCardInfo>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState();

	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { fireEvent: fireEventNext } = useAnalyticsEventsNext();
	const fireAnalytics = useCallback(
		(payload: AnalyticsEventPayload) => {
			if (createAnalyticsEvent) {
				fireEvent(createAnalyticsEvent, payload);
			}
		},
		[createAnalyticsEvent],
	);

	const creatorUserId = useMemo(
		() =>
			agentData?.creator_type === 'CUSTOMER' && agentData.creator
				? getAAIDFromARI(agentData.creator)
				: '',
		[agentData?.creator_type, agentData?.creator],
	);
	const { href: profileHref } = navigateToTeamsApp({
		type: 'USER',
		payload: {
			userId: creatorUserId || '',
		},
		cloudId: props.cloudId,
	});

	const getCreator = useCallback(
		async (creator_type: string, creator?: string) => {
			if (!creator) {
				return undefined;
			}
			switch (creator_type) {
				case 'SYSTEM':
					return { type: 'SYSTEM' as const };

				case 'THIRD_PARTY':
					return { type: 'THIRD_PARTY' as const, name: creator ?? '' };

				case 'CUSTOMER':
					try {
						if (!creatorUserId || !props.cloudId) {
							return undefined;
						}

						const creatorInfo = await props.resourceClient.getProfile(
							creatorUserId,
							props.cloudId,
							fireAnalytics,
							fireEventNext,
						);

						return {
							type: 'CUSTOMER' as const,
							name: creatorInfo.fullName,
							profileLink: fg('platform-adopt-teams-nav-config')
								? profileHref
								: `/people/${creatorUserId}`,
							id: creatorUserId,
						};
					} catch (error) {
						return undefined;
					}

				default:
					return undefined;
			}
		},
		[creatorUserId, fireAnalytics, fireEventNext, props.cloudId, props.resourceClient, profileHref],
	);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const profileData = await props.resourceClient.getRovoAgentProfile(
				{ type: 'identity', value: props.accountId },
				fireAnalytics,
				fireEventNext,
			);
			const agentCreatorInfo = await getCreator(
				profileData?.creator_type,
				profileData?.creator || undefined,
			);
			setAgentData({
				...profileData,
				creatorInfo: agentCreatorInfo,
			});
		} catch (err: any) {
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, [fireAnalytics, fireEventNext, getCreator, props.accountId, props.resourceClient]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (error || (!isLoading && !agentData)) {
		return (
			<AgentProfileCardWrapper>
				<ErrorMessage
					reload={() => {
						fetchData();
					}}
					errorType={error || null}
					fireAnalytics={() => {}}
					fireAnalyticsNext={fireEventNext}
				/>
			</AgentProfileCardWrapper>
		);
	}

	return (
		<Suspense fallback={null}>
			<AgentProfileCardLazy
				agent={agentData}
				isLoading={isLoading}
				hasError={!!error}
				onConversationStartersClick={props.onConversationStartersClick}
				onChatClick={props.onChatClick}
				addFlag={props.addFlag}
				resourceClient={props.resourceClient}
				cloudId={props.cloudId}
				onDeleteAgent={props.onDeleteAgent}
				hideMoreActions={props.hideMoreActions}
			/>
		</Suspense>
	);
};
