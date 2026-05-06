/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@atlaskit/css';

import { InlineCardUnauthorisedSocialProofExample } from './vr-inline-card-unauthorised-social-proof-example';

/**
 * Killswitch on + experiment enabled; persisted share below 30% → "Your team is previewing {provider}" pill.
 */
export default (): React.JSX.Element => (
	<InlineCardUnauthorisedSocialProofExample
		providerPercentage={15}
	/>
);
