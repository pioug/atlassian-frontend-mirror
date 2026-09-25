import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { AgentAvatar } from '../src/ui/agent-avatar';

const AVATARS = [
	'Customer Insight',
	'Backlog Buddy',
	'Decision Director',
	'Comms Crafter',
	'Auto Dev',
	'OKR Oracle',
	'Culture',
	'Social Media Scribe',
	'Team Connection',
	'Hire Writer',
	'Ops Agent',
	'Research Scout',
	'Release Notes',
	'My User Manual',
	'Pitch Perfector',
	'Auto Dev (repeated slot)',
	'Auto Fix',
	'Auto Review',
	'Marketing Message Maestro',
	'Feature Flag',
	'Product Requirement',
];

const styles = cssMap({ name: { width: '220px' }, avatar: { width: '64px', height: '64px' } });

export default function AgentAvatarRefreshExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box padding="space.200">
				<Stack space="space.100">
					<Text>Icon • Yellow • Purple • Green • Blue</Text>
					{AVATARS.map((name, index) => (
						<Inline key={name} space="space.200" alignBlock="center">
							<Box xcss={styles.name}>
								<Text>{name}</Text>
							</Box>
							{[0, 1, 2, 3].map((color) => (
								<Box key={color} xcss={styles.avatar}>
									<AgentAvatar
										agentIdentityAccountId={(index * 4 + color).toString(16)}
										size="large"
									/>
								</Box>
							))}
						</Inline>
					))}
				</Stack>
			</Box>
		</IntlProvider>
	);
}
