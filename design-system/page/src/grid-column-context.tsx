/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createContext } from 'react';

import { defaultMedium } from './constants';

/**
 * __Grid column context__
 *
 * A grid column context component for the Page component.
 *
 * - [Examples](https://atlassian.design/components/page/grid-column-context/examples)
 * - [Code](https://atlassian.design/components/page/grid-column-context/code)
 * - [Usage](https://atlassian.design/components/page/grid-column-context/usage)
 */
export const GridColumnContext: import('react').Context<{
	medium: number;
}> = createContext({ medium: defaultMedium });
