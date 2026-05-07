import React, { useState } from 'react';

import { cssMap } from '@compiled/react';
import { DiProvider, injectable } from 'react-magnetic-di';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Box, Stack } from '@atlaskit/primitives/compiled';

import { Card } from '../src';
import useSocialProofExperiment from '../src/state/hooks/use-social-proof-experiment';
import { mocks } from '../src/utils/mocks';

import ExampleContainer from './utils/example-container';
import VRTestWrapper from './utils/vr-test-wrapper';

const url = 'https://some.url';

const styles = cssMap({
	cardWidth: {
		width: '600px',
	},
});

class CustomClient extends CardClient {
	fetchData(_: string) {
		return Promise.resolve({
			...mocks.unauthorized,
			data: {
				...mocks.unauthorized.data,
				generator: {
					'@type': 'Application',
					icon: {
						'@type': 'Image',
						url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII=',
					},
					name: '3P',
				},
			},
			meta: {
				...mocks.unauthorized.meta,
				key: '3P',
			},
		} as JsonLd.Response);
	}
}

// Create mocks at module scope so injectable() is stable across renders.
const mockColdCache = injectable(useSocialProofExperiment, () => ({
	connectedPct: undefined,
	isLoading: false,
	tier: 'low' as const,
	isTreatment: false,
}));

const mockLow = injectable(useSocialProofExperiment, () => ({
	connectedPct: 15,
	isLoading: false,
	tier: 'low' as const,
	isTreatment: true,
}));

const mockNotLow = injectable(useSocialProofExperiment, () => ({
	connectedPct: 72,
	isLoading: false,
	tier: 'not-low' as const,
	isTreatment: true,
}));

const createSocialProofBlockCard = (
	scenario: 'cold-cache' | 'low' | 'not-low',
	mock: typeof mockColdCache,
) => {
	const Component = (): React.JSX.Element => (
		<VRTestWrapper dependencyOverrides={[mock]}>
			<SmartCardProvider product="CONFLUENCE" client={new CustomClient('staging')}>
				<Box xcss={styles.cardWidth}>
					<Card url={url} appearance="block" />
				</Box>
			</SmartCardProvider>
		</VRTestWrapper>
	);

	Component.displayName = `SocialProofBlockCard_${scenario}`;
	return Component;
};

export const SocialProofBlockCardLoading = createSocialProofBlockCard('cold-cache', mockColdCache);
export const SocialProofBlockCardLowTier = createSocialProofBlockCard('low', mockLow);
export const SocialProofBlockCardNotLowTier = createSocialProofBlockCard('not-low', mockNotLow);

type ScenarioConfig = {
	label: string;
	mock: typeof mockColdCache;
};

const scenarios: ScenarioConfig[] = [
	{
		label: 'Cold cache (TAP trait not available yet)',
		mock: mockColdCache,
	},
	{
		label: 'Low tier (< 30% connected, e.g. 15%)',
		mock: mockLow,
	},
	{
		label: 'Not-low tier (≥ 30% connected, e.g. 72%)',
		mock: mockNotLow,
	},
];

const VRBlockCardSocialProof: {
	(): JSX.Element;
	displayName: string;
} = (): JSX.Element => {
	const [activeIndex, setActiveIndex] = useState(0);
	const { label, mock } = scenarios[activeIndex];

	return (
		<ExampleContainer title="Block Card Social Proof">
			<Stack space="space.300">
				<ButtonGroup label="Select scenario">
					{scenarios.map(({ label: scenarioLabel }, index) => (
						<Button
							key={scenarioLabel}
							appearance={index === activeIndex ? 'primary' : 'default'}
							onClick={() => setActiveIndex(index)}
						>
							{scenarioLabel}
						</Button>
					))}
				</ButtonGroup>
				<Stack space="space.150">
					<Heading size="xsmall">{label}</Heading>
					<DiProvider key={activeIndex} use={[mock]}>
						<SmartCardProvider product="CONFLUENCE" client={new CustomClient('staging')}>
							<Box xcss={styles.cardWidth}>
								<Card url={url} appearance="block" />
							</Box>
						</SmartCardProvider>
					</DiProvider>
				</Stack>
			</Stack>
		</ExampleContainer>
	);
};

VRBlockCardSocialProof.displayName = 'VRBlockCardSocialProof';

export default VRBlockCardSocialProof;
