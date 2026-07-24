import { useContext } from 'react';

import { HasTextAncestorContext } from './has-text-ancestor-context';

/**
 * @internal
 */
export const useHasTextAncestor = (): boolean => useContext(HasTextAncestorContext);
