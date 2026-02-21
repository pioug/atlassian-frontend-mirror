/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext } from 'react';

import {
	type TabAttributesType,
	type TabListAttributesType,
	type TabPanelAttributesType,
} from '../types';

export const TabContext: import('react').Context<TabAttributesType | null> =
	createContext<TabAttributesType | null>(null);

export const TabListContext: import('react').Context<TabListAttributesType | null> =
	createContext<TabListAttributesType | null>(null);

export const TabPanelContext: import('react').Context<TabPanelAttributesType | null> =
	createContext<TabPanelAttributesType | null>(null);
