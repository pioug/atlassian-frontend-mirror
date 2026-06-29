import React from 'react';

import { SearchIcon as NewComponent } from '../artifacts/logo-components/search/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Search icon__
 *
 * The Search icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const SearchIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
