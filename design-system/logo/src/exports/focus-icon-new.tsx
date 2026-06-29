import React from 'react';

import { FocusIcon as NewComponent } from '../artifacts/logo-components/focus/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { FocusIcon as LegacyComponent } from '../legacy-logos/focus';
import type { LogoProps } from '../types';

/**
 * __Focus icon__
 *
 * The Focus icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const FocusIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
