import React from 'react';

import { MoreAtlassianAppsIcon as NewComponent } from '../artifacts/logo-components/more-atlassian-apps/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __More Atlassian Apps icon__
 *
 * The More Atlassian Apps icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const MoreAtlassianAppsIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
