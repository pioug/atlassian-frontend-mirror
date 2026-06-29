import React from 'react';

import { JiraServiceManagementLogoCS as NewComponent } from '../artifacts/logo-components/jira-service-management/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { JiraServiceManagementLogo as LegacyComponent } from '../legacy-logos/jira-service-management';
import type { LogoProps } from '../types';

/**
 * __Jira Service Management logo__
 *
 * The Jira Service Management logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraServiceManagementLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
