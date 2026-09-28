import React from 'react';

import { IntlProvider } from 'react-intl';

import Avatar from '@atlaskit/avatar/avatar';
import type { SizeType } from '@atlaskit/avatar/types';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { AgentAvatar } from '../src/ui/agent-avatar';
import customerInsightBlueV2 from './assets/customer_insight_blue_v2.png';

const CUSTOMER_INSIGHT_BLUE_AVATAR_ID = '3';

const SIZES: Array<{ label: string; size: SizeType }> = [
	{ label: '16px', size: 'xxsmall' },
	{ label: '20px', size: 'UNSAFE_xsmall' },
	{ label: '24px', size: 'small' },
	{ label: '32px', size: 'medium' },
	{ label: '40px', size: 'large' },
	{ label: '96px', size: 'xlarge' },
	{ label: '128px', size: 'xxlarge' },
];

const styles = cssMap({
	sizeColumn: { width: '64px' },
	avatarColumn: { width: '184px' },
});

export default function AgentAvatarComponentComparisonExample(): JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box padding="space.300" backgroundColor="color.background.accent.gray.bolder">
				<Stack space="space.300">
					<Heading size="medium" color="color.text.inverse">
						Customer Insight blue v2: PNG and generated SVG
					</Heading>
					<Inline space="space.100" alignBlock="center">
						<Box xcss={styles.sizeColumn} />
						<Box xcss={styles.avatarColumn}>
							<Text color="color.text.inverse">PNG · AgentAvatar</Text>
						</Box>
						<Box xcss={styles.avatarColumn}>
							<Text color="color.text.inverse">PNG · AgentAvatar (ADS)</Text>
						</Box>
						<Box xcss={styles.avatarColumn}>
							<Text color="color.text.inverse">PNG · Atlaskit Avatar</Text>
						</Box>
						<Box xcss={styles.avatarColumn}>
							<Text color="color.text.inverse">PNG · Atlaskit Avatar (updated)</Text>
						</Box>
						<Box xcss={styles.avatarColumn}>
							<Text color="color.text.inverse">SVG · AgentAvatar</Text>
						</Box>
						<Box xcss={styles.avatarColumn}>
							<Text color="color.text.inverse">SVG · AgentAvatar (ADS)</Text>
						</Box>
					</Inline>
					{SIZES.map(({ label, size }) => (
						<Inline key={size} space="space.100" alignBlock="center">
							<Box xcss={styles.sizeColumn}>
								<Text color="color.text.inverse">{label}</Text>
							</Box>
							<Box xcss={styles.avatarColumn}>
								<AgentAvatar imageUrl={customerInsightBlueV2} name="Customer Insight" size={size} />
							</Box>
							<Box xcss={styles.avatarColumn}>
								<AgentAvatar
									imageUrl={customerInsightBlueV2}
									name="Customer Insight"
									size={size}
									UNSAFE_useAdsAvatar
								/>
							</Box>
							<Box xcss={styles.avatarColumn}>
								<Avatar
									appearance="hexagon"
									src={customerInsightBlueV2}
									name="Customer Insight"
									size={size}
								/>
							</Box>
							<Box xcss={styles.avatarColumn}>
								<Avatar
									appearance="hexagon"
									src={customerInsightBlueV2}
									name="Customer Insight"
									size={size}
									UNSAFE_isUpdatedGeometry
								/>
							</Box>
							<Box xcss={styles.avatarColumn}>
								<AgentAvatar
									agentIdentityAccountId={CUSTOMER_INSIGHT_BLUE_AVATAR_ID}
									name="Customer Insight"
									size={size}
								/>
							</Box>
							<Box xcss={styles.avatarColumn}>
								<AgentAvatar
									agentIdentityAccountId={CUSTOMER_INSIGHT_BLUE_AVATAR_ID}
									name="Customer Insight"
									size={size}
									UNSAFE_useAdsAvatar
								/>
							</Box>
						</Inline>
					))}
				</Stack>
			</Box>
		</IntlProvider>
	);
}
