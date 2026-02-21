import { BitbucketIcon as NewBitbucketIcon } from '../artifacts/logo-components/bitbucket';
import { BitbucketIcon as LegacyBitbucketIcon } from '../legacy-logos/bitbucket';
import { createFeatureFlaggedComponent } from '../logo-config';
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
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(
	LegacyBitbucketIcon,
	NewBitbucketIcon,
);
