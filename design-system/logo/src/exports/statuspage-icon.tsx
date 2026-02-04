import { StatuspageIcon as NewStatuspageIcon } from '../artifacts/logo-components/statuspage';
import { StatuspageIcon as LegacyStatuspageIcon } from '../legacy-logos/statuspage';
import { createFeatureFlaggedComponent } from '../logo-config';
import type { LogoProps } from '../types';

/**
 * __Statuspage icon__
 *
 * The Statuspage icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const StatuspageIcon: ({ size, shouldUseNewLogoDesign, ...props }: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(
	LegacyStatuspageIcon,
	NewStatuspageIcon,
);
