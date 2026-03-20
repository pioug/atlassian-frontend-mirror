/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext } from 'react';

import { type TabAttributesType } from '../types';

export const TabContext: import('react').Context<TabAttributesType | null> =
	createContext<TabAttributesType | null>(null);
