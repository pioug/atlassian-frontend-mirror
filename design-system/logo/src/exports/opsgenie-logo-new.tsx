import React from 'react';

import { OpsgenieLogoCS as NewComponent } from '../artifacts/logo-components/opsgenie/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { OpsgenieLogo as LegacyComponent } from '../legacy-logos/opsgenie';
import type { LogoProps } from '../types';

/**
 * __Opsgenie logo__
 *
 * The Opsgenie logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const OpsgenieLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
