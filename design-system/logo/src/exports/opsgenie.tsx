import { OpsgenieIcon as NewOpsgenieIcon } from '../artifacts/logo-components/opsgenie';
import { OpsgenieIcon as LegacyOpsgenieIcon } from '../legacy-logos/opsgenie';
import { createFeatureFlaggedComponent } from '../logo-config';

/**
 * __Opsgenie icon__
 *
 * The Opsgenie icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const OpsgenieIcon = createFeatureFlaggedComponent(LegacyOpsgenieIcon, NewOpsgenieIcon);
