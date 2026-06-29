import React from 'react';

import { BitbucketDataCenterIcon as NewComponent } from '../artifacts/logo-components/bitbucket-data-center/icon';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Bitbucket Data Center icon__
 *
 * The Bitbucket Data Center icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketDataCenterIcon: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
