import React, { FC, useState } from 'react';

import { SkipLinksContext } from './skip-link-context';
import { SkipLinkData } from './types';

export const SkipLinksController: FC = ({ children }) => {
  const [links, setLinks] = useState<SkipLinkData[]>([]);

  const context = {
    registerSkipLink: (skipLinkData: SkipLinkData) => {
      // Don't add duplicate SkipLinks
      if (!links.map((link) => link.id).includes(skipLinkData.id)) {
        setLinks([skipLinkData, ...links]);
      }
    },
    skipLinksData: links,
    unregisterSkipLink: (id: string | undefined) => {
      setLinks((links) => links.filter((link) => link.id !== id));
    },
  };

  return (
    <SkipLinksContext.Provider value={context}>
      {children}
    </SkipLinksContext.Provider>
  );
};
