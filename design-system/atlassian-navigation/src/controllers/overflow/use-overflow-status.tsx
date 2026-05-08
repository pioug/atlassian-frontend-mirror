import { useContext } from 'react';

import { OverflowContext } from './overflow-context';

/**
 * __useOverFlowStatus__
 *
 * Returns the current context value for the nearest OverflowProvider.
 *
 * - [Example](https://atlassian.design/components/atlassian-navigation/examples#responsive)
 */
export const useOverflowStatus = (): OverflowContext => useContext(OverflowContext);
