import { createContext } from 'react';

/**
 * Context for the side nav toggle button element.
 * Used to power the side nav flyout by allowing the side nav to bind event listeners to the button element.
 */
export const SideNavToggleButtonElement: import('react').Context<HTMLButtonElement | null> =
	createContext<HTMLButtonElement | null>(null);
