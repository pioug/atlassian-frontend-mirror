/* eslint-disable @repo/internal/react/require-jsdoc */

import { createContext } from 'react';

import { type TabAttributesType } from '../types';
import { type TabMotionAttributes } from './tab-motion-context';

type InternalTabAttributes = TabAttributesType & TabMotionAttributes;

export const TabContext: import('react').Context<InternalTabAttributes | null> =
	createContext<InternalTabAttributes | null>(null);
