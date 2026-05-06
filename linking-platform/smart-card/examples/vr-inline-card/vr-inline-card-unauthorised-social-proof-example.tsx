/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { DiProvider, injectable } from 'react-magnetic-di';

import { jsx } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getCachedProviderPctMapAndRefresh } from '../../src/state/services/personalization';
import { InlineCardUnauthorizedView } from '../../src/view/InlineCard/UnauthorisedView';
import VRTestWrapper from '../utils/vr-test-wrapper';

type InlineCardUnauthorisedSocialProofExampleProps = {
	includeContext?: boolean;
	providerPercentage: number;
};

const bodyFontTokens = [token('font.body'), token('font.body.large')];

export const InlineCardUnauthorisedSocialProofExample = ({
	providerPercentage,
	includeContext = true,
}: InlineCardUnauthorisedSocialProofExampleProps): React.JSX.Element => {
	const mockGetProviderPctMapSync = injectable(getCachedProviderPctMapAndRefresh, () => ({
		'figma-object-provider': providerPercentage,
	}));

	const socialProofDi = [mockGetProviderPctMapSync];

	const renderInlineCard = () => (
		<InlineCardUnauthorizedView
			url="https://www.figma.com/file/aK9mJ2pLqrX5vW"
			context={includeContext ? 'Figma' : undefined}
			extensionKey="figma-object-provider"
			onAuthorise={() => {}}
			testId="inline-card-unauthorized-view"
		/>
	);

	return (
		<DiProvider use={socialProofDi}>
			<VRTestWrapper>
				<Stack space="space.100">
					{bodyFontTokens.map((bodyFontToken) => (
						<Box key={bodyFontToken} style={{ font: bodyFontToken }}>
							{renderInlineCard()}
						</Box>
					))}
				</Stack>
			</VRTestWrapper>
		</DiProvider>
	);
};
