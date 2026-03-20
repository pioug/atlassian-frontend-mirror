/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext } from 'react';

import { type TabListAttributesType } from '../types';

export const TabListContext: import('react').Context<TabListAttributesType | null> =
	createContext<TabListAttributesType | null>(null);
