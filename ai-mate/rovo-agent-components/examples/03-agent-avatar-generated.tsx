import React from 'react';

import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Grid } from "@atlaskit/primitives";
import { Box, Inline } from "@atlaskit/primitives/compiled";

import { AgentAvatar } from '../src/ui/agent-avatar';
import { TOTAL_AVATAR_COMBINATIONS } from '../src/ui/agent-avatar/generated-avatars';

export default function (): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box padding="space.300" backgroundColor="color.background.accent.gray.subtlest.pressed">
				<Grid templateColumns="1fr 1fr" gap="space.200">
					{Array.from({ length: TOTAL_AVATAR_COMBINATIONS }, (_, i) => {
						// Converting to hex, in order to display all possible combinations of avatars, the GeneratedAvatar is using hex number to do combinations
						const hexString = i.toString(16);
						return (
							<Inline key={hexString} space="space.100" alignBlock="center">
								<AgentAvatar agentIdentityAccountId={hexString} size="xxlarge" />
								<AgentAvatar agentIdentityAccountId={hexString} size="xlarge" />
								<AgentAvatar agentIdentityAccountId={hexString} size="large" />
								<AgentAvatar agentIdentityAccountId={hexString} size="medium" />
								<AgentAvatar agentIdentityAccountId={hexString} size="small" />
								<AgentAvatar agentIdentityAccountId={hexString} size="xsmall" />
							</Inline>
						);
					})}
				</Grid>
			</Box>
		</IntlProvider>
	);
}
