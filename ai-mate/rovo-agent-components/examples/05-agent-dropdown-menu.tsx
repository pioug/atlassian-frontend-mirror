import React from 'react';

import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from '@atlaskit/primitives';

import { AgentDropdownMenu } from '../src';

export default function () {
	return (
		<IntlProvider locale="en">
			<Box padding="space.400">
				<Inline alignBlock="center" alignInline="center">
					<AgentDropdownMenu
						agentId="1"
						isForgeAgent={false}
						loadAgentPermissions={() =>
							Promise.resolve({ isEditEnabled: true, isDeleteEnabled: true })
						}
					/>
				</Inline>
			</Box>
		</IntlProvider>
	);
}
