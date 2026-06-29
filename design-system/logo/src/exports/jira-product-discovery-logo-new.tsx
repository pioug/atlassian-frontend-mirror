import React from 'react';

import { JiraProductDiscoveryLogoCS as NewComponent } from '../artifacts/logo-components/jira-product-discovery/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { JiraProductDiscoveryLogo as LegacyComponent } from '../legacy-logos/jira-product-discovery';
import type { LogoProps } from '../types';

/**
 * __Jira Product Discovery logo__
 *
 * The Jira Product Discovery logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraProductDiscoveryLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
