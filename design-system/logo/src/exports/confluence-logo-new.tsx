import React from 'react';

import { ConfluenceLogoCS as NewComponent } from '../artifacts/logo-components/confluence/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { ConfluenceLogo as LegacyComponent } from '../legacy-logos/confluence';
import type { LogoProps } from '../types';

/**
 * __Confluence logo__
 *
 * The Confluence logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
