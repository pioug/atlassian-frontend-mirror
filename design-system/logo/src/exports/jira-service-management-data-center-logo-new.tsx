import React from 'react';

import { JiraServiceManagementDataCenterLogoCS as NewComponent } from '../artifacts/logo-components/jira-service-management-data-center/logo-cs';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Jira Service Management Data Center logo__
 *
 * The Jira Service Management Data Center logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraServiceManagementDataCenterLogoCS: ({
	size,
	...props
}: LogoProps) => React.JSX.Element = tempSizeWrapper(NewComponent);
