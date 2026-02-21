import { JiraServiceManagementIcon as NewJSIcon } from '../artifacts/logo-components/jira-service-management';
import { JiraServiceManagementIcon as LegacyJSIcon } from '../legacy-logos/jira-service-management';
import { createFeatureFlaggedServiceCollectionComponent } from '../logo-config';
import type { LogoProps } from '../types';

/**
 * __Jira service management icon__
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
}: LogoProps) => React.JSX.Element = createFeatureFlaggedServiceCollectionComponent(
	LegacyJSIcon,
	NewJSIcon,
);
