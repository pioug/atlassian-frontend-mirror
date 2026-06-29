import React from 'react';

import { CompassLogoCS as NewComponent } from '../artifacts/logo-components/compass/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { CompassLogo as LegacyComponent } from '../legacy-logos/compass';
import type { LogoProps } from '../types';

/**
 * __Compass logo__
 *
 * The Compass logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const CompassLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
