import React from 'react';

import { BitbucketLogoCS as NewComponent } from '../artifacts/logo-components/bitbucket/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { BitbucketLogo as LegacyComponent } from '../legacy-logos/bitbucket';
import type { LogoProps } from '../types';

/**
 * __Bitbucket logo__
 *
 * The Bitbucket logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const BitbucketLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
