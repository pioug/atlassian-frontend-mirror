import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { getAgentCreator } from '@atlaskit/rovo-agent-components/ui/AgentProfileInfo';
import { navigateToTeamsApp } from '@atlaskit/teams-app-config/navigation';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';

import {
	type AgentActionsType,
	type Flag,
	type ProfileClient,
	type RovoAgentAgg,
	type RovoAgentProfileCardInfo,
	type TriggerType,
} from '../../types';
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
	/** Hide the AI disclaimer. Defaults to false (disclaimer is shown by default). */
	hideAiDisclaimer?: boolean;
	/** Hide the conversation starters. Defaults to false (conversation starters are shown by default). */
	hideConversationStarters?: boolean;
} & AgentActionsType;

export const AgentProfileCardResourced = (
	props: AgentProfileCardResourcedProps,
): React.JSX.Element => {
	const [agentData, setAgentData] = useState<RovoAgentProfileCardInfo>();
	// Initialize as true when fix is enabled since we fetch immediately on mount,
	// avoiding a brief error screen flash before the useEffect fires.
	const [isLoading, setIsLoading] = useState<boolean>(
		fg('jira_ai_fix_agent_profile_card_flashing'),
	);
	const [error, setError] = useState();

	const { fireEvent } = useAnalyticsEventsNext();
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
		async ({
			creator_type,
			creator,
			authoringTeam,
		}: {
			creator_type: string;
			creator?: string;
			authoringTeam?: RovoAgentAgg['authoringTeam'];
		}) => {
			try {
				let userCreatorInfo;
				if (creatorUserId && props.cloudId) {
					userCreatorInfo = await props.resourceClient.getProfile(
						props.cloudId,
						creatorUserId,
						fireEvent,
					);
				}

				const creatorInfo = getAgentCreator({
					creatorType: creator_type ?? '',
					authoringTeam: authoringTeam
						? {
								displayName: authoringTeam.displayName ?? '',
								profileLink: authoringTeam.profileUrl ?? undefined,
							}
						: undefined,
					userCreator: userCreatorInfo
						? {
								name: userCreatorInfo.fullName ?? '',
								profileLink: fg('platform-adopt-teams-nav-config')
									? profileHref
									: `/people/${creatorUserId}`,
							}
						: undefined,
					forgeCreator: creator ?? undefined,
				});

				return creatorInfo;
			} catch {
				return undefined;
			}
		},
		[creatorUserId, fireEvent, props.cloudId, props.resourceClient, profileHref],
	);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const profileResult = await props.resourceClient.getRovoAgentProfile(
				{ type: 'identity', value: props.accountId },
				fireEvent,
			);

			const profileData = profileResult.restData;

			const creatorInfoProps = {
				creator_type: profileData?.creator_type,
				creator: profileData?.creator || undefined,
				authoringTeam: profileResult.aggData?.authoringTeam ?? undefined,
			};

			const agentCreatorInfo = await getCreator(creatorInfoProps);

			setAgentData({
				...profileData,
				creatorInfo: agentCreatorInfo,
			});
		} catch (err: any) {
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, [fireEvent, getCreator, props.accountId, props.resourceClient]);

	// Depend on accountId rather than fetchData to avoid a re-fetch loop:
	// agentData changes → creatorUserId → getCreator → fetchData ref changes → useEffect re-fires.
	// Reset state on accountId change so stale data from the previous agent isn't briefly shown.
	useEffect(() => {
		if (!fg('jira_ai_fix_agent_profile_card_flashing')) {
			return;
		}
		setAgentData(undefined);
		setError(undefined);
		setIsLoading(true);
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.accountId]);

	useEffect(() => {
		if (fg('jira_ai_fix_agent_profile_card_flashing')) {
			return;
		}
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
					fireAnalytics={fireEvent}
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
				hideAiDisclaimer={props.hideAiDisclaimer}
				hideConversationStarters={props.hideConversationStarters}
			/>
		</Suspense>
	);
};
