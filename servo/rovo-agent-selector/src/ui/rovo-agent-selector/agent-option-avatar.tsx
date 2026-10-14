import React from 'react';

import { graphql, useFragment } from 'react-relay';

import Avatar from '@atlaskit/avatar/avatar';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { AgentAvatar } from '@atlaskit/rovo-agent-components/ui/AgentAvatar';

import type { agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$key } from './__generated__/agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar.graphql';
import type { AgentOption } from './types';

type AgentFragmentKey = agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$key;

type AgentOptionAvatarProps = {
	option: AgentOption;
	agentFragment: AgentFragmentKey | null;
};

export function AgentOptionAvatar({ option, agentFragment }: AgentOptionAvatarProps): JSX.Element {
	if (!fg('migrate-agent-avatar-component-to-ads')) {
		return (
			<AgentAvatar
				agentId={option.value}
				agentNamedId={option.externalConfigReference}
				agentIdentityAccountId={option.identityAccountId}
				size="small"
				showBorder={false}
				isForgeAgent={option.isForgeAgent}
			/>
		);
	}

	return <IdentityAgentOptionAvatar name={option.label} agentFragment={agentFragment} />;
}

type IdentityAgentOptionAvatarProps = {
	name: string;
	agentFragment: AgentFragmentKey | null;
};

function IdentityAgentOptionAvatar({
	name,
	agentFragment,
}: IdentityAgentOptionAvatarProps): JSX.Element {
	const agent = useFragment(
		graphql`
			fragment agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar on AgentStudioAssistant
			@argumentDefinitions(
				migrateAgentAvatar: {
					type: "Boolean!"
					provider: "./migrate-agent-avatar-component-to-ads.relayprovider.tsx"
				}
			) {
				identityAccount @include(if: $migrateAgentAvatar) {
					picture
				}
			}
		`,
		agentFragment,
	);

	return (
		<Avatar
			appearance="hexagon"
			src={agent?.identityAccount?.picture ?? undefined}
			name={name}
			label={name}
			size="small"
			borderColor="transparent"
			UNSAFE_isUpdatedGeometry
		/>
	);
}
