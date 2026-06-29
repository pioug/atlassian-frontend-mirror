import React from 'react';

import { JiraLogoCS as NewComponent } from '../artifacts/logo-components/jira/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { JiraLogo as LegacyComponent } from '../legacy-logos/jira';
import type { LogoProps } from '../types';

/**
 * __Jira logo__
 *
 * The Jira logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
