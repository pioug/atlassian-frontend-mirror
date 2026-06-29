import React from 'react';

import { BitbucketDataCenterLogoCS as NewComponent } from '../artifacts/logo-components/bitbucket-data-center/logo-cs';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Bitbucket Data Center logo__
 *
 * The Bitbucket Data Center logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketDataCenterLogoCS: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
