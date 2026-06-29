import React from 'react';

import { ConfluenceIcon as NewComponent } from '../artifacts/logo-components/confluence/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { ConfluenceIcon as LegacyComponent } from '../legacy-logos/confluence';
import type { LogoProps } from '../types';

/**
 * __Confluence icon__
 *
 * The Confluence icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
