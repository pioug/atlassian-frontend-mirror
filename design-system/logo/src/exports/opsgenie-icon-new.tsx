import React from 'react';

import { OpsgenieIcon as NewComponent } from '../artifacts/logo-components/opsgenie/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { OpsgenieIcon as LegacyComponent } from '../legacy-logos/opsgenie';
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
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
