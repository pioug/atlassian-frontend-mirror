import React from 'react';

import { GoalsIcon as NewComponent } from '../artifacts/logo-components/goals/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Goals icon__
 *
 * The Goals icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const GoalsIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
