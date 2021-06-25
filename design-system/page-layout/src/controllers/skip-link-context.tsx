import { createContext, useContext, useEffect } from 'react';

import { SkipLinkContextProps, SkipLinkData } from './types';

const noop = () => {};

export const SkipLinksContext = createContext<SkipLinkContextProps>({
  skipLinksData: [],
  registerSkipLink: noop,
  unregisterSkipLink: noop,
});

export const useSkipLinks = () => useContext(SkipLinksContext);

export const useSkipLink = (
  id?: SkipLinkData['id'],
  skipLinkTitle?: SkipLinkData['skipLinkTitle'],
) => {
  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();
  useEffect(() => {
    if (id && skipLinkTitle) {
      registerSkipLink({ id, skipLinkTitle });
    }
    return () => {
      unregisterSkipLink(id);
    };
  }, [id, skipLinkTitle, registerSkipLink, unregisterSkipLink]);
};
