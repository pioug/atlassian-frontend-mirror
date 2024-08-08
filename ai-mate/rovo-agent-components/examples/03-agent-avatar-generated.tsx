import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { Box, Grid, Inline } from '@atlaskit/primitives';

import { AgentAvatar } from '../src/ui/agent-avatar';
import { TOTAL_AVATAR_COMBINATIONS } from '../src/ui/agent-avatar/generated-avatars';

export default function () {
	return (
		<IntlProvider locale="en">
			<Box padding="space.300" backgroundColor="color.background.accent.gray.subtlest.pressed">
				<Grid templateColumns="1fr 1fr" gap="space.200">
					{Array.from({ length: TOTAL_AVATAR_COMBINATIONS }, (_, i) => {
						// Converting to hex, in order to display all possible combinations of avatars, the GeneratedAvatar is using hex number to do combinations
						const hexString = i.toString(16);
						return (
							<Inline key={hexString} space="space.100" alignBlock="center">
								<AgentAvatar agentId={hexString} size="xxlarge" />
								<AgentAvatar agentId={hexString} size="xlarge" />
								<AgentAvatar agentId={hexString} size="large" />
								<AgentAvatar agentId={hexString} size="medium" />
								<AgentAvatar agentId={hexString} size="small" />
								<AgentAvatar agentId={hexString} size="xsmall" />
							</Inline>
						);
					})}
				</Grid>
			</Box>
		</IntlProvider>
	);
}
