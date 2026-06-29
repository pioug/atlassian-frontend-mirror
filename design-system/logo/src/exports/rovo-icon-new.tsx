import React from 'react';

import { RovoIcon as NewComponent } from '../artifacts/logo-components/rovo/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { RovoIcon as LegacyComponent } from '../legacy-logos/rovo';
import type { LogoProps } from '../types';

/**
 * __Rovo icon__
 *
 * The Rovo icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const RovoIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
