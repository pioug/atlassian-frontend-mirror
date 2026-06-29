import React from 'react';

import { JiraIcon as NewComponent } from '../artifacts/logo-components/jira/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { JiraIcon as LegacyComponent } from '../legacy-logos/jira';
import type { LogoProps } from '../types';

/**
 * __Jira icon__
 *
 * The Jira icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
