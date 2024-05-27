/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext } from 'react';

import {
  type TabAttributesType,
  type TabListAttributesType,
  type TabPanelAttributesType,
} from '../types';

export const TabContext = createContext<TabAttributesType | null>(null);

export const TabListContext = createContext<TabListAttributesType | null>(null);

export const TabPanelContext = createContext<TabPanelAttributesType | null>(
  null,
);
