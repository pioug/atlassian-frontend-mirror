import React from 'react';

import { IntlProvider } from 'react-intl';

import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import { AgentAvatar } from '../src/ui/agent-avatar';
import { imageAgentAvatar } from './helpers';

export default function (): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- the rule does not yet recognise @atlaskit/primitives subpath entry points */}
			<Box padding="space.300" backgroundColor="color.background.accent.purple.subtler.pressed">
				<Stack alignInline="center">
					<Heading size="medium">Sizes</Heading>
					<br />
					<Inline space="space.300" alignBlock="end" alignInline="center">
						<Stack alignBlock="start" alignInline="center" space="space.200">
							<AgentAvatar imageUrl={imageAgentAvatar} size="xxsmall" />
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
