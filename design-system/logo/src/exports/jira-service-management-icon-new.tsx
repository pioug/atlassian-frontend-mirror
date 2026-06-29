import React from 'react';

import { JiraServiceManagementIcon as NewComponent } from '../artifacts/logo-components/jira-service-management/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { JiraServiceManagementIcon as LegacyComponent } from '../legacy-logos/jira-service-management';
import type { LogoProps } from '../types';

/**
 * __Jira Service Management icon__
 *
 * The Jira Service Management icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraServiceManagementIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
