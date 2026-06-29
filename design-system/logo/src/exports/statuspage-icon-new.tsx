import React from 'react';

import { StatuspageIcon as NewComponent } from '../artifacts/logo-components/statuspage/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { StatuspageIcon as LegacyComponent } from '../legacy-logos/statuspage';
import type { LogoProps } from '../types';

/**
 * __Statuspage icon__
 *
 * The Statuspage icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const StatuspageIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
