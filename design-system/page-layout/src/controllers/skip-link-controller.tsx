import React, { FC, useCallback, useState } from 'react';

import { SkipLinksContext } from './skip-link-context';
import { SkipLinkData } from './types';

export const SkipLinksController: FC = ({ children }) => {
  const [links, setLinks] = useState<SkipLinkData[]>([]);

  const context = {
    registerSkipLink: useCallback(
      (skipLinkData: SkipLinkData) => {
        if (!links.map(link => link.id).includes(skipLinkData.id)) {
          setLinks([skipLinkData, ...links]);
        }
      },
      [links],
    ),
    skipLinksData: links,
    unregisterSkipLink: useCallback(
      (id: string | undefined) => {
        const filtered = links.filter(link => link.id !== id);
        setLinks(filtered);
      },
      [links],
    ),
  };

  return (
    <SkipLinksContext.Provider value={context}>
      {children}
    </SkipLinksContext.Provider>
  );
};
