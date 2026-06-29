import React from 'react';

import { BitbucketIcon as NewComponent } from '../artifacts/logo-components/bitbucket/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { BitbucketIcon as LegacyComponent } from '../legacy-logos/bitbucket';
import type { LogoProps } from '../types';

/**
 * __Bitbucket icon__
 *
 * The Bitbucket icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
