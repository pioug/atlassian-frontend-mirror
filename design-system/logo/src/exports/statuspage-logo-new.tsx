import React from 'react';

import { StatuspageLogoCS as NewComponent } from '../artifacts/logo-components/statuspage/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { StatuspageLogo as LegacyComponent } from '../legacy-logos/statuspage';
import type { LogoProps } from '../types';

/**
 * __Statuspage logo__
 *
 * The Statuspage logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const StatuspageLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
