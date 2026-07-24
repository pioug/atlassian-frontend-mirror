import { type Provider } from 'react';

import { HasTextAncestorContext } from './has-text-ancestor-context';

/**
 * @internal
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const HasTextAncestorProvider: Provider<boolean> = HasTextAncestorContext.Provider;
