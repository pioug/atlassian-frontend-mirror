/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';
import { graphql, readInlineData, usePaginationFragment } from 'react-relay';

import { jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Select from '@atlaskit/select/default';

import { useSuspenselessRefetch } from '../../common/utils/use-suspenseless-refetch';
import type { agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$key } from './__generated__/agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar.graphql';
import type { rovoAgentSelector_agent$key } from './__generated__/rovoAgentSelector_agent.graphql';
import type { rovoAgentSelector_AtlaskitRovoAgentSelector$key } from './__generated__/rovoAgentSelector_AtlaskitRovoAgentSelector.graphql';
import rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQueryNode, {
	type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery,
} from './__generated__/rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery.graphql';
import { AgentOptionAvatar } from './agent-option-avatar';
import messages from './messages';
import type { AgentOption, RovoAgentSelectorProps } from './types';

export const AGENT_SELECT_ID = 'rovo-agent-select';

const DEBOUNCE_DELAY = 500;
const PAGE_SIZE = 30;

// Simple debounce hook
function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number): T {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback(
		((...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		}) as T,
		[callback, delay],
	);
}

export function RovoAgentSelector({
	testId,
	isFeatureEnabled: isFeatureEnabledOverride,
	fragmentReference,
	cloudId,
	selectedAgent,
	onChange,
	isLoading: isLoadingOverride,
	isDisabled = false,
}: RovoAgentSelectorProps): JSX.Element | null {
	const { formatMessage } = useIntl();
	const isFeatureEnabled = isFeatureEnabledOverride ?? fg('jsm_help_center_one-click_rovo_agent');
	const [, setSearchInput] = useState<string | null>(null);

	/* eslint-disable @atlassian/relay/graphql-naming -- Preserve the public fragment name used by existing consumers. */
	const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
		rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery,
		rovoAgentSelector_AtlaskitRovoAgentSelector$key
	>(
		graphql`
			fragment rovoAgentSelector_AtlaskitRovoAgentSelector on Query
			@refetchable(queryName: "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery")
			@argumentDefinitions(
				cloudIdString: { type: "String!" }
				first: { type: "Int", defaultValue: 30 }
				after: { type: "String" }
				input: { type: "AgentStudioAgentQueryInput", defaultValue: { onlyEditableAgents: true } }
				enableAgentCreationFix: {
					type: "Boolean!"
					provider: "@atlaskit/rovo-agent-selector/hubs-management-rovo-agent-creation-fix.relayprovider"
				}
			) {
				agentStudio_getAgents(cloudId: $cloudIdString, first: $first, after: $after, input: $input)
					@optIn(to: "AgentStudio")
					@connection(key: "RovoAgent_agentStudio_getAgents") {
					pageInfo {
						hasNextPage
						endCursor
					}
					edges {
						node {
							... @skip(if: $enableAgentCreationFix) {
								id
								name
								externalConfigReference
								identityAccountId
								creatorType
							}
							...agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar
							...rovoAgentSelector_agent
								@include(if: $enableAgentCreationFix)
								@alias(as: "selectorAgent")
						}
					}
				}
			}
		`,
		fragmentReference,
	);
	/* eslint-enable @atlassian/relay/graphql-naming */

	const agents = useMemo(
		() =>
			data?.agentStudio_getAgents?.edges
				?.map((edge) =>
					fg('hubs_management_rovo_agent_creation_fix')
						? readInlineData<rovoAgentSelector_agent$key>(
								graphql`
									fragment rovoAgentSelector_agent on AgentStudioAssistant @inline {
										id
										name
										externalConfigReference
										identityAccountId
										creatorType
										...agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar
									}
								`,
								edge?.node?.selectorAgent,
							)
						: edge?.node,
				)
				.filter((agent) => agent != null) ?? [],
		[data?.agentStudio_getAgents?.edges],
	);

	const agentOptions: AgentOption[] = useMemo(
		() =>
			agents
				.map((agent) => ({
					label: agent?.name ?? '',
					value: agent?.id ?? '',
					externalConfigReference: agent?.externalConfigReference ?? undefined,
					identityAccountId: agent?.identityAccountId ?? undefined,
					isForgeAgent: fg('rovo_agent_support_a2a_avatar')
						? agent?.creatorType === 'THIRD_PARTY' ||
							agent?.creatorType === 'FORGE' ||
							agent?.creatorType === 'REMOTE_A2A'
						: agent?.creatorType === 'FORGE',
				}))
				.filter((option: AgentOption) => option.label),
		[agents],
	);

	// Keyed by agent id so consumer-built `selectedAgent` values also resolve their Identity avatar
	const agentFragmentsById = useMemo(() => {
		const agentFragments = new Map<
			string,
			agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$key
		>();
		agents.forEach((agent) => {
			if (agent?.id) {
				agentFragments.set(agent.id, agent);
			}
		});
		return agentFragments;
	}, [agents]);

	const [suspenselessRefetch, isRefetching] = useSuspenselessRefetch<
		rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery,
		rovoAgentSelector_AtlaskitRovoAgentSelector$key
	>(rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQueryNode, refetch);

	const debouncedRefetch = useDebouncedCallback(
		useCallback(
			(searchTerm: string) => {
				const input = {
					onlyEditableAgents: true,
					...(searchTerm.trim() ? { name: searchTerm.trim() } : {}), // Exclude searchTerm if empty as empty string causes request to fail
				};

				suspenselessRefetch({
					cloudIdString: cloudId,
					enableAgentCreationFix: fg('hubs_management_rovo_agent_creation_fix'),
					input,
				});
			},
			[cloudId, suspenselessRefetch],
		),
		DEBOUNCE_DELAY,
	);

	const handleInputChange = useCallback(
		(inputValue: string) => {
			setSearchInput(inputValue);
			debouncedRefetch(inputValue);
		},
		[setSearchInput, debouncedRefetch],
	);

	const handleMenuScrollToBottom = useCallback(() => {
		if (hasNext && !isLoadingNext && !isRefetching) {
			loadNext(PAGE_SIZE);
		}
	}, [hasNext, isLoadingNext, isRefetching, loadNext]);

	const handleUpdateAgent = useCallback(
		(option: AgentOption | null) => {
			onChange?.(option);
		},
		[onChange],
	);

	const isLoading = isLoadingOverride ?? (isRefetching || isLoadingNext);

	if (!isFeatureEnabled) {
		return null;
	}

	return (
		<Box testId={testId}>
			<Stack space="space.050">
				<Label htmlFor={AGENT_SELECT_ID}>
					<Text weight="semibold">{formatMessage(messages.selectorLabel)}</Text>
				</Label>
				<Select<AgentOption>
					inputId={AGENT_SELECT_ID}
					placeholder={formatMessage(messages.rovoAgentPlaceholder)}
					options={agentOptions}
					value={selectedAgent}
					noOptionsMessage={() => formatMessage(messages.noOptionsMessage)}
					onChange={handleUpdateAgent}
					onInputChange={handleInputChange}
					isSearchable
					filterOption={() => true} // Disabled filtering in component since options are cached and filtered in relay store
					isLoading={isLoading}
					isDisabled={isDisabled}
					onMenuScrollToBottom={handleMenuScrollToBottom}
					formatOptionLabel={(option: AgentOption) => (
						<Inline alignBlock="center" space="space.075">
							<AgentOptionAvatar
								option={option}
								agentFragment={agentFragmentsById.get(option.value) ?? null}
							/>
							<Text size="small" color="color.text.subtle">
								{option.label}
							</Text>
						</Inline>
					)}
				/>
			</Stack>
		</Box>
	);
}
