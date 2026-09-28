/* eslint-disable @repo/internal/react/require-jsdoc */
import { type Context, createContext } from 'react';

export type TabMotionDirection = 'left' | 'right';
export type TabMotionState = 'entering' | 'exiting' | 'visible';

export type TabMotionAttributes = {
	'data-motion-capable'?: 'true';
	'data-motion-direction'?: TabMotionDirection;
	'data-motion-state'?: TabMotionState;
};

export type TabMotionContextValue = {
	getTabMotionAttributes: (index: number) => TabMotionAttributes;
};

export const TabMotionContext: Context<TabMotionContextValue | null> =
	createContext<TabMotionContextValue | null>(null);
