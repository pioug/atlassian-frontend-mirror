import React from 'react';

import { useIntl } from 'react-intl-next';
import { graphql, useFragment } from 'react-relay';

import type { IconSize } from '@atlaskit/icon';
import VerifiedIcon from '@atlaskit/icon/core/status-verified';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { agentVerified_AtlaskitRovoAgentComponents$key } from './__generated__/agentVerified_AtlaskitRovoAgentComponents.graphql';
import messages from './messages';

export type AgentVerifiedProps = {
	agentRef: agentVerified_AtlaskitRovoAgentComponents$key | null;
	size?: IconSize;
}

export const AgentVerified = ({
	agentRef,
	size = 'small',
}: AgentVerifiedProps) => {
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

	return <AgentVerifiedIcon size={size} />
};

export type AgentVerifiedIconProps = {
	size?: IconSize;
}

export const AgentVerifiedIcon = ({ size = 'small' }: AgentVerifiedIconProps) => {
	const { formatMessage } = useIntl();
	return (
		<Tooltip content={formatMessage(messages.verifiedAgentTooltip)}>
			<VerifiedIcon
				color={token('color.icon.accent.blue')}
				label={formatMessage(messages.verifiedIconLabel)}
				size={size}
			/>
		</Tooltip>
	);
}
