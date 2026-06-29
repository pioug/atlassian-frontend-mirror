import React from 'react';

import { LoomAttributionLogoCS as NewComponent } from '../artifacts/logo-components/loom-attribution/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { LoomAttributionLogo as LegacyComponent } from '../legacy-logos/loom-attribution';
import type { LogoProps } from '../types';

/**
 * __Loom Attribution logo__
 *
 * The Loom Attribution logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomAttributionLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
