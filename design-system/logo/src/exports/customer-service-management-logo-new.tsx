import React from 'react';

import { CustomerServiceManagementLogoCS as NewComponent } from '../artifacts/logo-components/customer-service-management/logo-cs';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Customer Service Management logo__
 *
 * The Customer Service Management logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const CustomerServiceManagementLogoCS: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
