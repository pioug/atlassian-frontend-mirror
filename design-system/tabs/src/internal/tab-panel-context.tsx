/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext } from 'react';

import { type TabPanelAttributesType } from '../types';

export const TabPanelContext: import('react').Context<TabPanelAttributesType | null> =
	createContext<TabPanelAttributesType | null>(null);
