import { OpsgenieIcon as NewOpsgenieIcon } from '../artifacts/logo-components/opsgenie';
import { OpsgenieIcon as LegacyOpsgenieIcon } from '../legacy-logos/opsgenie';
import { createFeatureFlaggedComponent } from '../logo-config';
import type { LogoProps } from '../types';

/**
 * __Opsgenie icon__
 *
 * The Opsgenie icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const OpsgenieIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(
	LegacyOpsgenieIcon,
	NewOpsgenieIcon,
);
