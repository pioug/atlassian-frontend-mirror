import React from 'react';

import { TalentIcon as NewComponent } from '../artifacts/logo-components/talent/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Talent icon__
 *
 * The Talent icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const TalentIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
