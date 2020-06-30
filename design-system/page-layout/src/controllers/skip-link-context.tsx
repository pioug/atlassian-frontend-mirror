import { createContext, useContext } from 'react';

import { SkipLinkContextProps } from './types';

const noop = () => {};

export const SkipLinksContext = createContext<SkipLinkContextProps>({
  skipLinksData: [],
  registerSkipLink: noop,
  unregisterSkipLink: noop,
});

export const useSkipLinks = () => useContext(SkipLinksContext);
