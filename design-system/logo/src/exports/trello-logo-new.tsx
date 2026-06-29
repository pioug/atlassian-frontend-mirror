import React from 'react';

import { TrelloLogoCS as NewComponent } from '../artifacts/logo-components/trello/logo-cs';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { TrelloLogo as LegacyComponent } from '../legacy-logos/trello';
import type { LogoProps } from '../types';

/**
 * __Trello logo__
 *
 * The Trello logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const TrelloLogoCS: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
