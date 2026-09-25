/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { IntlProvider } from 'react-intl';

import type { SizeType } from '@atlaskit/avatar/types';
import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';

import { AgentAvatar } from '../src/ui/agent-avatar/index';
import { imageAgentAvatar } from './helpers';

const sizes: Array<{ label: string; size: SizeType }> = [
	{ label: '16px', size: 'xxsmall' },
	{ label: '20px', size: 'UNSAFE_xsmall' },
	{ label: '24px', size: 'small' },
	{ label: '32px', size: 'medium' },
	{ label: '40px', size: 'large' },
	{ label: '96px', size: 'xlarge' },
	{ label: '128px', size: 'xxlarge' },
];

const comparisonStates = [
	{ label: 'Legacy AgentAvatar', useAdsAvatar: false },
	{ label: 'UNSAFE_useAdsAvatar (ADS Avatar)', useAdsAvatar: true },
];

const generatedArtworkExamples = [
	{ agentNamedId: 'decision_director_agent', label: 'Native hexagon artwork' },
	{ agentNamedId: 'mcp_amplitude_agent', label: 'Square third-party artwork' },
];

export default function AgentAvatarAdsWrapperExample(): JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box padding="space.300" backgroundColor="color.background.accent.purple.subtlest">
				<Stack space="space.400">
					<Stack space="space.100">
						<Heading size="medium">AgentAvatar ADS Avatar opt-in</Heading>
						<Text as="p">
							Compare the existing custom AgentAvatar with the UNSAFE_useAdsAvatar opt-in, which
							delegates the hexagon frame and border to ADS Avatar.
						</Text>
					</Stack>
					{sizes.map(({ label: sizeLabel, size }) => (
						<Stack key={size} space="space.100">
							<Heading as="h3" size="small">
								{sizeLabel}
							</Heading>
							<Inline space="space.400" alignBlock="center" shouldWrap>
								{comparisonStates.map(({ label, useAdsAvatar }) => (
									<Stack key={label} space="space.100" alignInline="center">
										<Text>{label}</Text>
										<AgentAvatar
											imageUrl={imageAgentAvatar}
											name={label}
											size={size}
											UNSAFE_useAdsAvatar={useAdsAvatar}
										/>
									</Stack>
								))}
							</Inline>
						</Stack>
					))}
					<Stack space="space.300">
						<Heading as="h3" size="small">
							Generated artwork at 32px
						</Heading>
						{generatedArtworkExamples.map(({ agentNamedId, label: artworkLabel }) => (
							<Stack key={agentNamedId} space="space.100">
								<Text>{artworkLabel}</Text>
								<Inline space="space.400" alignBlock="center" shouldWrap>
									{comparisonStates.map(({ label, useAdsAvatar }) => (
										<Stack key={label} space="space.100" alignInline="center">
											<Text>{label}</Text>
											<AgentAvatar
												agentNamedId={agentNamedId}
												name={artworkLabel}
												size="medium"
												UNSAFE_useAdsAvatar={useAdsAvatar}
											/>
										</Stack>
									))}
								</Inline>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Box>
		</IntlProvider>
	);
}
