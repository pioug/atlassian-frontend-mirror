import React from 'react';

import { CompassIcon as NewComponent } from '../artifacts/logo-components/compass/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { CompassIcon as LegacyComponent } from '../legacy-logos/compass';
import type { LogoProps } from '../types';

/**
 * __Compass icon__
 *
 * The Compass icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const CompassIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
