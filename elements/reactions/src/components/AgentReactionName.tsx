/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

import { messages } from '../shared/i18n';
import { type User } from '../types';

const styles = cssMap({
	loading: {
		display: 'inline-flex',
		verticalAlign: 'middle',
		flexGrow: 1,
		width: '100%',
		minWidth: '120px',
		opacity: token('opacity.loading'),
	},
});

export const AgentReactionName = ({
	agent,
	personName,
}: {
	agent: NonNullable<User['agent']>;
	personName: string;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	if (fg('platform_reactions_agent_name_skeleton') && agent.isLoading) {
		return (
			<div css={styles.loading} role="status" aria-label={formatMessage(messages.loadingReactions)}>
				<Skeleton
					width="100%"
					height="12px"
					isShimmering
					color="currentColor"
					ShimmeringEndColor="transparent"
					testId="agent-name-skeleton"
				/>
			</div>
		);
	}
	return (
		<FormattedMessage
			{...messages.agentWithPerson}
			values={{ agentName: agent.name, personName }}
		/>
	);
};
