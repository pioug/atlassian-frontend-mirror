import React, { FC, useRef, useState } from 'react';

import { PAGE_LAYOUT_SLOT_SELECTOR } from '../common/constants';

import { SkipLinksContext } from './skip-link-context';
import { SkipLinkData } from './types';

const byDOMOrder = (a: SkipLinkData, b: SkipLinkData) => {
  const elems = Array.from(
    document.querySelectorAll(`[${PAGE_LAYOUT_SLOT_SELECTOR}]`),
  );
  const elemA = document.getElementById(a.id);
  const elemB = document.getElementById(b.id);

  const indexA = a.listIndex ?? elems.indexOf(elemA!);
  const indexB = b.listIndex ?? elems.indexOf(elemB!);

  /**
   * If they are tied it is because one (or both) is
   * a custom skiplink with a set index.
   *
   * Give the custom skiplink priority.
   */
  if (indexA === indexB) {
    if (a.listIndex !== undefined) {
      return -1;
    } else {
      return 1;
    }
  }

  return indexA - indexB;
};

export const SkipLinksController: FC = ({ children }) => {
  const [links, setLinks] = useState<SkipLinkData[]>([]);

  const registerSkipLink = useRef((skipLinkData: SkipLinkData) => {
    // Don't add duplicate SkipLinks
    setLinks((oldLinks) => {
      if (oldLinks.some(({ id }) => id === skipLinkData.id)) {
        return oldLinks;
      }
      return [...oldLinks, skipLinkData].sort(byDOMOrder);
    });
  });

  const unregisterSkipLink = useRef((id: string | undefined) => {
    setLinks((links) => links.filter((link) => link.id !== id));
  });

  const context = {
    registerSkipLink: registerSkipLink.current,
    skipLinksData: links,
    unregisterSkipLink: unregisterSkipLink.current,
  };

  return (
    <SkipLinksContext.Provider value={context}>
      {children}
    </SkipLinksContext.Provider>
  );
};
