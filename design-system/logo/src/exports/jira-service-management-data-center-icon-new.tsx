import React from 'react';

import { JiraServiceManagementDataCenterIcon as NewComponent } from '../artifacts/logo-components/jira-service-management-data-center/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Jira Service Management Data Center icon__
 *
 * The Jira Service Management Data Center icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const JiraServiceManagementDataCenterIcon: ({
	size,
	...props
}: LogoProps) => React.JSX.Element = tempSizeWrapper(NewComponent);
