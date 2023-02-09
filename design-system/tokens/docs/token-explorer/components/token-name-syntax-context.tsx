/** @jsx jsx */
import { createContext } from 'react';

export type TokenNameSyntax = 'default' | 'css-var';

interface ContextValue {
  syntax: TokenNameSyntax;
}

export const TokenNameSyntaxContext = createContext<ContextValue>({
  syntax: 'default',
});
