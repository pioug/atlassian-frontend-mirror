import { ConfluenceIcon as NewConfluenceIcon } from '../artifacts/logo-components/confluence';
import { ConfluenceIcon as LegacyConfluenceIcon } from '../legacy-logos/confluence';
import { createFeatureFlaggedComponent } from '../logo-config';
import type { LogoProps } from '../types';
/**
 * __Confluence icon__
 *
 * The Confluence icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const ConfluenceIcon: ({ size, shouldUseNewLogoDesign, ...props }: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(
	LegacyConfluenceIcon,
	NewConfluenceIcon,
);
