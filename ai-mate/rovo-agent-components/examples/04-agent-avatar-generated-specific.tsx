import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { Box, Grid, Inline } from '@atlaskit/primitives';

import { AgentAvatar } from '../src/ui/agent-avatar';

export default function () {
	return (
		<IntlProvider locale="en">
			<Box padding="space.300" backgroundColor="color.background.accent.gray.subtlest.pressed">
				<Grid templateColumns="1fr 1fr" gap="space.200">
					{[
						{ agentId: undefined, agentNamedId: undefined },
						{ agentId: 'random-123-541-12321', agentNamedId: 'decision_director_agent' },
						{ agentId: 'random-123-541-12321', agentNamedId: 'user_manual_writer_agent' },
						{ agentId: 'random-123-541-12321', agentNamedId: 'product_requirements_expert_agent' },
					].map(({ agentId, agentNamedId }, i) => {
						return (
							<Box>
								<Box paddingBlock="space.100">
									{agentId ? `agentNamedId: ${agentNamedId}` : 'Default avatar'}
								</Box>
								<Inline key={i} space="space.100" alignBlock="center">
									<AgentAvatar agentId={agentId} agentNamedId={agentNamedId} size="xxlarge" />
									<AgentAvatar agentId={agentId} agentNamedId={agentNamedId} size="xlarge" />
									<AgentAvatar agentId={agentId} agentNamedId={agentNamedId} size="large" />
									<AgentAvatar agentId={agentId} agentNamedId={agentNamedId} size="medium" />
									<AgentAvatar agentId={agentId} agentNamedId={agentNamedId} size="small" />
									<AgentAvatar agentId={agentId} agentNamedId={agentNamedId} size="xsmall" />
								</Inline>
							</Box>
						);
					})}
				</Grid>
			</Box>
		</IntlProvider>
	);
}
