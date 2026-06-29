import React from 'react';

import { RovoLogoCS as NewComponent } from '../artifacts/logo-components/rovo/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { RovoLogo as LegacyComponent } from '../legacy-logos/rovo';
import type { LogoProps } from '../types';

/**
 * __Rovo logo__
 *
 * The Rovo logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const RovoLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
