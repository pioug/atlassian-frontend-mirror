import React from 'react';

import { LoomLogoCS as NewComponent } from '../artifacts/logo-components/loom/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { LoomLogo as LegacyComponent } from '../legacy-logos/loom';
import type { LogoProps } from '../types';

/**
 * __Loom logo__
 *
 * The Loom logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
