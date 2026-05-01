import { useContext } from 'react';

import { SkipLinksContext } from './skip-links-context';
import { type SkipLinkContextProps } from './types';

export const useSkipLinks = (): SkipLinkContextProps => useContext(SkipLinksContext);
