import React from 'react';

import { ConfluenceDataCenterLogoCS as NewComponent } from '../artifacts/logo-components/confluence-data-center/logo-cs';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Confluence Data Center logo__
 *
 * The Confluence Data Center logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceDataCenterLogoCS: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
