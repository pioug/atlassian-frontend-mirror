import { createContext } from 'react';

import {
  TabAttributesType,
  TabListAttributesType,
  TabPanelAttributesType,
} from '../types';

export const TabContext = createContext<TabAttributesType | null>(null);

export const TabListContext = createContext<TabListAttributesType | null>(null);

export const TabPanelContext = createContext<TabPanelAttributesType | null>(
  null,
);
