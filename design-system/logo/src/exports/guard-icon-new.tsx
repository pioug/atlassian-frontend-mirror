import React from 'react';

import { GuardIcon as NewComponent } from '../artifacts/logo-components/guard/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { GuardIcon as LegacyComponent } from '../legacy-logos/guard';
import type { LogoProps } from '../types';

/**
 * __Guard icon__
 *
 * The Guard icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const GuardIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
