/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl-next';
import { graphql, useFragment, usePaginationFragment } from 'react-relay';

import { jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { AgentAvatar } from '@atlaskit/rovo-agent-components';
import Select from '@atlaskit/select';

import { useSuspenselessRefetch } from '../../common/utils/use-suspenseless-refetch';

import type { rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$key } from './__generated__/rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference.graphql';
import type { rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference$key } from './__generated__/rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference.graphql';
import type { rovoAgentSelectorInternal_AtlaskitRovoAgentSelector$key } from './__generated__/rovoAgentSelectorInternal_AtlaskitRovoAgentSelector.graphql';
import rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQueryNode, {
	type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery,
} from './__generated__/rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery.graphql';
import messages from './messages';
import type { AgentOption, RovoAgentSelectorProps } from './types';
import { UnentitledState } from './unentitled';

interface RovoAgentSelectorInternalProps extends Omit<RovoAgentSelectorProps, 'fragmentReference'> {
	fragmentReference: rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference$key;
}

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

function RovoAgentSelectorInternal({
	testId,
	isFeatureEnabled: isFeatureEnabledOverride,
	fragmentReference,
	cloudId,
	selectedAgent,
	onChange,
	isLoading: isLoadingOverride,
}: RovoAgentSelectorInternalProps) {
	const { formatMessage } = useIntl();
	const isFeatureEnabled = isFeatureEnabledOverride ?? fg('jsm_help_center_one-click_rovo_agent');
	const [, setSearchInput] = useState<string | null>(null);

	const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
		rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery,
		rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference$key
	>(
		graphql`
			fragment rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference on Query
			@refetchable(queryName: "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery")
			@argumentDefinitions(
				cloudIdString: { type: "String!" }
				first: { type: "Int", defaultValue: 30 }
				after: { type: "String" }
				input: { type: "AgentStudioAgentQueryInput", defaultValue: { onlyEditableAgents: true } }
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
							id
							name
							externalConfigReference
							identityAccountId
							creatorType
						}
					}
				}
			}
		`,
		fragmentReference,
	);

	const agentOptions: AgentOption[] = useMemo(() => {
		return (
			data?.agentStudio_getAgents?.edges
				?.map((edge: { node: any }) => edge?.node)
				.filter((node: any) => node != null)
				.map((agent: any) => ({
					label: agent?.name ?? '',
					value: agent?.id ?? '',
					externalConfigReference: agent?.externalConfigReference ?? undefined,
					identityAccountId: agent?.identityAccountId ?? undefined,
					isForgeAgent: agent?.creatorType === 'FORGE',
				}))
				.filter((option: AgentOption) => option.label) ?? []
		);
	}, [data?.agentStudio_getAgents?.edges]);

	const [suspenselessRefetch, isRefetching] = useSuspenselessRefetch<
		rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery,
		rovoAgentSelectorInternal_AtlaskitRovoAgentSelector$key
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
					onMenuScrollToBottom={handleMenuScrollToBottom}
					formatOptionLabel={({
						label,
						value,
						externalConfigReference,
						identityAccountId,
						isForgeAgent,
					}: AgentOption) => (
						<Inline alignBlock="center" space="space.075">
							<AgentAvatar
								agentId={value}
								agentNamedId={externalConfigReference}
								agentIdentityAccountId={identityAccountId}
								size="small"
								showBorder={false}
								isForgeAgent={isForgeAgent}
							/>
							<Text size="small" color="color.text.subtle">
								{label}
							</Text>
						</Inline>
					)}
				/>
			</Stack>
		</Box>
	);
}

export const RovoAgentSelector = (props: RovoAgentSelectorProps) => {
	const { fragmentReference, ...restProps } = props;

	const permissionsData =
		useFragment<rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$key>(
			graphql`
				fragment rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference on Query
				@argumentDefinitions(cloudIdString: { type: "String!" }, cloudId: { type: "ID!" }) {
					atlassianStudio_userSiteContext(cloudId: $cloudId) {
						... on AtlassianStudioUserSiteContextOutput {
							userPermissions {
								isAbleToCreateAgents
							}
						}
					}
					...rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference
						@arguments(cloudIdString: $cloudIdString)
				}
			`,
			fragmentReference,
		);

	const canCreateAgents =
		permissionsData?.atlassianStudio_userSiteContext?.userPermissions?.isAbleToCreateAgents ??
		false;

	// TODO: add check here for rovo entitlement
	if (!canCreateAgents) {
		return <UnentitledState canCreateAgents={canCreateAgents} />;
	}

	return <RovoAgentSelectorInternal {...restProps} fragmentReference={permissionsData} />;
};
