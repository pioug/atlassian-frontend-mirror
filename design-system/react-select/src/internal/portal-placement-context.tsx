import { createContext } from 'react';

import type { CoercedMenuPlacement } from '../types';

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Portal placement context__
 *
 * A portal placement context {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const PortalPlacementContext = createContext<{
	setPortalPlacement: (placement: CoercedMenuPlacement) => void;
} | null>(null);
