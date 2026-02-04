import { TrelloIcon as NewTrelloIcon } from '../artifacts/logo-components/trello';
import { TrelloIcon as LegacyTrelloIcon } from '../legacy-logos/trello';
import { createFeatureFlaggedComponent } from '../logo-config';
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
export const TrelloIcon: ({ size, shouldUseNewLogoDesign, ...props }: LogoProps) => React.JSX.Element = createFeatureFlaggedComponent(LegacyTrelloIcon, NewTrelloIcon);
