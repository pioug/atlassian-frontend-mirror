import React from 'react';

import { AnalyticsIcon as NewComponent } from '../artifacts/logo-components/analytics/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Analytics icon__
 *
 * The Analytics icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AnalyticsIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
