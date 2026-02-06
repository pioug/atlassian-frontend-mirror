import React from 'react';

import { useIntl } from 'react-intl-next';
import { graphql, useFragment } from 'react-relay';

import { cssMap, cx } from '@atlaskit/css';
import VerifiedIcon from '@atlaskit/icon/core/status-verified';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { agentVerified_AtlaskitRovoAgentComponents$key } from './__generated__/agentVerified_AtlaskitRovoAgentComponents.graphql';
import messages from './messages';

export type AgentVerifiedProps = AgentVerifiedIconProps & {
	agentRef: agentVerified_AtlaskitRovoAgentComponents$key | null;
};

export const AgentVerified = ({ agentRef, adjacentTextSize }: AgentVerifiedProps) => {
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

export type AgentVerifiedIconProps = {
	/**
	 * Height matches line-height of adjacent text for proper vertical alignment
	 * when inline content wraps to multiple lines.
	 */
	adjacentTextSize?: 'body' | 'textLarge' | 'headingMedium' | 'headingLarge';
};

const styles = cssMap({
	body: { height: '20px' },
	textLarge: { height: '24px' },
	headingMedium: { height: '24px' },
	headingLarge: { height: '28px' },
});

export const AgentVerifiedIcon = ({ adjacentTextSize = 'body' }: AgentVerifiedIconProps) => {
	const { formatMessage } = useIntl();

	return (
		<Tooltip content={formatMessage(messages.verifiedAgentTooltip)}>
			<Flex
				justifyContent="center"
				alignItems="center"
				xcss={cx(
					adjacentTextSize === 'body' && styles['body'],
					adjacentTextSize === 'headingMedium' && styles['headingMedium'],
					adjacentTextSize === 'headingLarge' && styles['headingLarge'],
					adjacentTextSize === 'textLarge' && styles['textLarge'],
				)}
			>
				<VerifiedIcon
					color={token('color.icon.accent.blue')}
					label={formatMessage(messages.verifiedIconLabel)}
					size="small"
				/>
			</Flex>
		</Tooltip>
	);
};
