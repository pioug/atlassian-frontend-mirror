import React from 'react';

import { ConfluenceDataCenterIcon as NewComponent } from '../artifacts/logo-components/confluence-data-center/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Confluence Data Center icon__
 *
 * The Confluence Data Center icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceDataCenterIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
