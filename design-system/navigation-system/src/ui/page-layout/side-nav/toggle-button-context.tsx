import { createContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';
/**
 * Context for the side nav toggle button element.
 * Used to power the side nav flyout by allowing the side nav to bind event listeners to the button element.
 */
export const SideNavToggleButtonElement = createContext<HTMLButtonElement | null>(null);

/**
 * Context for the callback ref used to respond to toggle button ref being attached. It is used to update the
 * `SideNavToggleButtonRef` state so consumers can react to the ref being attached.
 *
 * e.g. Once the side nav toggle button has been mounted, the side nav can bind mouse event listeners to it
 * to power the sidenav flyout.
 *
 * A callback ref is needed because the side nav can be mounted before the elements in the top bar (e.g. if the element
 *  is lazy loaded, which happens in Jira and Confluence), which would prevent the event listeners from being set up.
 */
export const SideNavToggleButtonAttachRef =
	createContext<(newVal: HTMLButtonElement | null) => void>(__noop);
