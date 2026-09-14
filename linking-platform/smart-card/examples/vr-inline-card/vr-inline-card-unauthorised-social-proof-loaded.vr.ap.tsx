/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@atlaskit/css';

import { InlineCardUnauthorisedSocialProofExample } from './vr-inline-card-unauthorised-social-proof-example';

/**
 * Killswitch on + experiment enabled; 52% adoption → Tag pill previews headline, button reads "Connect".
 */
export default (): React.JSX.Element => (
	<InlineCardUnauthorisedSocialProofExample providerPercentage={52} />
);
