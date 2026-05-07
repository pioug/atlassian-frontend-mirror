import React from 'react';

import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@atlaskit/primitives/compiled';

import { messages } from '../../../messages';
import type { SocialProofTier } from '../../../state/hooks/use-social-proof-experiment';

export interface SocialProofMessageProps {
	/** The connected users percentage for the current provider. Only shown for 'not-low' tier. */
	connectedPct?: number;
	/** The 3P provider display name (e.g. "OneDrive", "Google Drive"). */
	providerName: string;
	/** Test ID for the component. */
	testId?: string;
	/** The social proof tier — determines which copy variant to show. */
	tier: SocialProofTier;
}

// TODO: remove when social-proof-3p-unauth-block-fg is cleaned up
const SocialProofMessage = ({
	tier,
	connectedPct,
	providerName,
	testId = 'smart-block-social-proof-message',
}: SocialProofMessageProps) => {
	const message =
		tier === 'not-low'
			? messages.pre_auth_block_social_proof_not_low
			: messages.pre_auth_block_social_proof_low;

	return (
		<Box testId={testId}>
			<FormattedMessage
				{...message}
				values={{
					percentage: connectedPct ?? 0,
					provider: providerName,
					b: (chunks: React.ReactNode) => (
						<Text as="strong" weight="bold">
							{chunks}
						</Text>
					),
				}}
			/>
		</Box>
	);
};

export default SocialProofMessage;
