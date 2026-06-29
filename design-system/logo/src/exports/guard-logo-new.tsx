import React from 'react';

import { GuardLogoCS as NewComponent } from '../artifacts/logo-components/guard/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { GuardLogo as LegacyComponent } from '../legacy-logos/guard';
import type { LogoProps } from '../types';

/**
 * __Guard logo__
 *
 * The Guard logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const GuardLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
