import React from 'react';

import { AssetsIcon as NewComponent } from '../artifacts/logo-components/assets/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Assets icon__
 *
 * The Assets icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const AssetsIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
