/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@atlaskit/css';

import { InlineCardUnauthorisedSocialProofExample } from './vr-inline-card-unauthorised-social-proof-example';

/**
 * Killswitch on + experiment enabled; context missing and 30%+ adoption → no-context percentage pill and short Connect.
 */
export default (): React.JSX.Element => (
	<InlineCardUnauthorisedSocialProofExample
		providerPercentage={52}
		includeContext={false}
	/>
);
