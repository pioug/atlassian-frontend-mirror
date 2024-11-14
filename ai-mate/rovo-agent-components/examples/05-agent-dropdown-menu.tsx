import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { Box, Inline } from '@atlaskit/primitives';

import { AgentDropdownMenu } from '../src';

export default function () {
	return (
		<IntlProvider locale="en">
			<Box padding="space.400">
				<Inline alignBlock="center" alignInline="center">
					<AgentDropdownMenu agentId="1" isAgentCreatedByUser={true} isForgeAgent={false} />
				</Inline>
			</Box>
		</IntlProvider>
	);
}
