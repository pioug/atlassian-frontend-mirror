import React from 'react';

import { TrelloIcon as NewComponent } from '../artifacts/logo-components/trello/icon';
import { createFeatureFlaggedComponent } from '../create-feature-flagged-component';
import { TrelloIcon as LegacyComponent } from '../legacy-logos/trello';
import type { LogoProps } from '../types';

/**
 * __Trello icon__
 *
 * The Trello icon without an accompanying wordmark.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const TrelloIcon: ({
	size,
	shouldUseNewLogoDesign,
	...props
}: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyComponent, NewComponent);
