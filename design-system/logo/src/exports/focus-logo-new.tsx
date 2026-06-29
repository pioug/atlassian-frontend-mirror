import React from 'react';

import { FocusLogoCS as NewComponent } from '../artifacts/logo-components/focus/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { FocusLogo as LegacyComponent } from '../legacy-logos/focus';
import type { LogoProps } from '../types';

/**
 * __Focus logo__
 *
 * The Focus logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const FocusLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
