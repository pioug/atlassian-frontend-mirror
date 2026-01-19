import React from 'react';

import { useIntl } from 'react-intl-next';
import { graphql, useFragment } from 'react-relay';

import type { IconSize } from '@atlaskit/icon';
import VerifiedIcon from '@atlaskit/icon/core/status-verified';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { agentVerified_AtlaskitRovoAgentComponents$key } from './__generated__/agentVerified_AtlaskitRovoAgentComponents.graphql';
import messages from './messages';

export const AgentVerified = ({
	agentRef,
	size = 'small',
}: {
	agentRef: agentVerified_AtlaskitRovoAgentComponents$key | null;
	size?: IconSize;
}) => {
	const { formatMessage } = useIntl();

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

	return (
		<Tooltip content={formatMessage(messages.verifiedAgentTooltip)}>
			<VerifiedIcon
				color={token('color.icon.accent.blue')}
				label={formatMessage(messages.verifiedIconLabel)}
				size={size}
			/>
		</Tooltip>
	);
};
