import React from 'react';

import { LoomIcon as NewComponent } from '../artifacts/logo-components/loom/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { LoomIcon as LegacyComponent } from '../legacy-logos/loom';
import type { LogoProps } from '../types';

/**
 * __Loom icon__
 *
 * The Loom icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const LoomIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
