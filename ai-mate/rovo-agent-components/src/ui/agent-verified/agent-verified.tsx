import React from 'react';

import { graphql, useFragment } from 'react-relay';

import type { agentVerified_AtlaskitRovoAgentComponents$key } from './__generated__/agentVerified_AtlaskitRovoAgentComponents.graphql';
import { AgentVerifiedIcon } from './agent-verified-icon';

export const AgentVerified = ({
	agentRef,
	adjacentTextSize,
}: AgentVerifiedProps): React.JSX.Element | null => {
	const data = useFragment(
		graphql`
			fragment agentVerified_AtlaskitRovoAgentComponents on AgentStudioAssistant {
				isVerified
			}
		`,
		agentRef,
	);

	if (!data?.isVerified) {
		return null;
	}

	return <AgentVerifiedIcon adjacentTextSize={adjacentTextSize} />;
};
export type AgentVerifiedProps = AgentVerifiedIconProps & {
	agentRef: agentVerified_AtlaskitRovoAgentComponents$key | null;
};
export type AgentVerifiedIconProps = {
	/**
	 * Height matches line-height of adjacent text for proper vertical alignment
	 * when inline content wraps to multiple lines.
	 */
	adjacentTextSize?: 'body' | 'textLarge' | 'headingMedium' | 'headingLarge';
};
