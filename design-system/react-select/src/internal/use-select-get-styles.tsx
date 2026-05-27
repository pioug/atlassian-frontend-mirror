/**
 * Hook to consume the SelectGetStylesContext.
 *
 * @internal — not part of the public API
 */
import { useContext } from 'react';

import { SelectGetStylesContext } from './select-get-styles-context';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const useSelectGetStyles = (): Function | undefined => useContext(SelectGetStylesContext);
