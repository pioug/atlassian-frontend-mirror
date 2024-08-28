import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';

import {
	type AgentActionsType,
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
	viewingUserId?: string;
	product?: string;
} & AgentActionsType;
export const AgentProfileCardResourced = (props: AgentProfileCardResourcedProps) => {
	const [agentData, setAgentData] = useState<RovoAgentProfileCardInfo>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState();

	const { createAnalyticsEvent } = useAnalyticsEvents();
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
						);

						return {
							type: 'CUSTOMER' as const,
							name: creatorInfo.fullName,
							profileLink: `/people/${creatorUserId}`,
							id: creatorUserId,
						};
					} catch (error) {
						return undefined;
					}

				default:
					return undefined;
			}
		},
		[creatorUserId, fireAnalytics, props.cloudId, props.resourceClient],
	);

	const getAgentInfo = useCallback(() => {
		return props.resourceClient.getRovoAgentProfile(
			{ type: 'identity', value: props.accountId },
			fireAnalytics,
		);
	}, [fireAnalytics, props.accountId, props.resourceClient]);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		const getAgentData = async (): Promise<RovoAgentProfileCardInfo> => {
			const profileData = await getAgentInfo();
			const agentCreatorInfo = await getCreator(
				profileData?.creator_type,
				profileData?.creator || undefined,
			);
			return {
				...profileData,
				creatorInfo: agentCreatorInfo,
			};
		};

		const agentData = await getAgentData();
		setAgentData(agentData);
		setIsLoading(false);
	}, [getAgentInfo, getCreator]);

	useEffect(() => {
		try {
			fetchData();
		} catch (error: any) {
			setIsLoading(false);
			setError(error);
		}
	}, [fetchData, getAgentInfo, getCreator, props.accountId, props.cloudId, props.resourceClient]);

	if (error || (!isLoading && !agentData)) {
		return (
			<AgentProfileCardWrapper>
				<ErrorMessage
					reload={() => {
						fetchData();
					}}
					errorType={error || null}
					fireAnalytics={() => {}}
				/>
			</AgentProfileCardWrapper>
		);
	}

	if (agentData) {
		return (
			<AgentProfileCardLazy
				agent={agentData}
				isLoading={isLoading}
				hasError={!!error}
				isCreatedByViewingUser={creatorUserId === props.viewingUserId}
				product={props.product}
				onConversationStartersClick={props.onConversationStartersClick}
				onChatClick={props.onChatClick}
			/>
		);
	}

	return null;
};
