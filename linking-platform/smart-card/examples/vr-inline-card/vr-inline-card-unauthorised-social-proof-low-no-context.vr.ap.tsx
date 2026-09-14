/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@atlaskit/css';

import { InlineCardUnauthorisedSocialProofExample } from './vr-inline-card-unauthorised-social-proof-example';

/**
 * Killswitch on + experiment enabled; traits are loaded but no provider-specific percentage and no context.
 */
export default (): React.JSX.Element => (
	<InlineCardUnauthorisedSocialProofExample includeContext={false} />
);
