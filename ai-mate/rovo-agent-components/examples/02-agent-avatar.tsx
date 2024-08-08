import React from 'react';

import { IntlProvider } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { AgentAvatar } from '../src/ui/agent-avatar';

import { imageAgentAvatar } from './helpers';

export default function () {
	return (
		<IntlProvider locale="en">
			<Box padding="space.300" backgroundColor="color.background.accent.purple.subtler.pressed">
				<Stack alignInline="center">
					<Heading size="xlarge">Sizes</Heading>
					<br />
					<Inline space="space.300" alignBlock="end" alignInline="center">
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="xsmall" />
							<Heading size="small">xsmall</Heading>
						</Stack>
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="small" />
							<Heading size="small">small</Heading>
						</Stack>
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="medium" />
							<Heading size="small">medium</Heading>
						</Stack>
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="large" />
							<Heading size="small">large</Heading>
						</Stack>
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="xlarge" />
							<Heading size="small">xlarge</Heading>
						</Stack>
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="xxlarge" />
							<Heading size="small">xxlarge</Heading>
						</Stack>
					</Inline>
				</Stack>
			</Box>
		</IntlProvider>
	);
}
