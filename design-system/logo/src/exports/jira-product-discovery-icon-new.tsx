import React from 'react';

import { JiraProductDiscoveryIcon as NewComponent } from '../artifacts/logo-components/jira-product-discovery/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { JiraProductDiscoveryIcon as LegacyComponent } from '../legacy-logos/jira-product-discovery';
import type { LogoProps } from '../types';

/**
 * __Jira Product Discovery icon__
 *
 * The Jira Product Discovery icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraProductDiscoveryIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
