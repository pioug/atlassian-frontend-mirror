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
	containerWidth?: React.CSSProperties['width'];
	includeContext?: boolean;
	providerPercentage?: number;
	url?: string;
};

const bodyFontTokens = [token('font.body'), token('font.body.large')];

export const InlineCardUnauthorisedSocialProofExample = ({
	containerWidth,
	providerPercentage,
	includeContext = true,
	url = 'https://www.figma.com/file/aK9mJ2pLqrX5vW',
}: InlineCardUnauthorisedSocialProofExampleProps): React.JSX.Element => {
	const mockGetProviderPctMapSync = injectable(getCachedProviderPctMapAndRefresh, () =>
		providerPercentage === undefined ? {} : { 'figma-object-provider': providerPercentage },
	);

	const socialProofDi = [mockGetProviderPctMapSync];

	const renderInlineCard = () => (
		<InlineCardUnauthorizedView
			url={url}
			context={includeContext ? 'Figma' : undefined}
			extensionKey="figma-object-provider"
			onAuthorise={() => {}}
			testId="inline-card-unauthorized-view"
		/>
	);

	const inlineCards = (
		<Stack space="space.100">
			{bodyFontTokens.map((bodyFontToken) => (
				<Box key={bodyFontToken} style={{ font: bodyFontToken }}>
					{renderInlineCard()}
				</Box>
			))}
		</Stack>
	);

	return (
		<DiProvider use={socialProofDi}>
			<VRTestWrapper>
				{containerWidth ? <Box style={{ width: containerWidth }}>{inlineCards}</Box> : inlineCards}
			</VRTestWrapper>
		</DiProvider>
	);
};
