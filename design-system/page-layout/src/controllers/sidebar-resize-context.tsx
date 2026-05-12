import { type Context, createContext, type KeyboardEvent, type MouseEvent } from 'react';

import noop from '@atlaskit/ds-lib/noop';

import { type LeftSidebarState } from './types';

const leftSidebarState: LeftSidebarState = {
	isFlyoutOpen: false,
	isResizing: false,
	isLeftSidebarCollapsed: false,
	leftSidebarWidth: 0,
	lastLeftSidebarWidth: 0,
	flyoutLockCount: 0,
	isFixed: true,
	hasInit: false,
};

export type SidebarResizeContextValue = {
	isLeftSidebarCollapsed: boolean;
	expandLeftSidebar: () => void;
	collapseLeftSidebar: (
		event?: MouseEvent | KeyboardEvent,
		collapseWithoutTransition?: boolean,
	) => void;
	/**
	 * Conditionally expands or collapses the left sidebar based on the current state.
	 * This is aware of our flyout mode in mobile as well.
	 */
	toggleLeftSidebar: (
		event?: MouseEvent | KeyboardEvent,
		collapseWithoutTransition?: boolean,
	) => void;
	leftSidebarState: LeftSidebarState;
	setLeftSidebarState: (
		value: LeftSidebarState | ((prevState: LeftSidebarState) => LeftSidebarState),
	) => void;
};
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SidebarResizeContext: Context<SidebarResizeContextValue> =
	createContext<SidebarResizeContextValue>({
		isLeftSidebarCollapsed: false,
		expandLeftSidebar: noop,
		collapseLeftSidebar: noop,
		leftSidebarState,
		setLeftSidebarState: noop,
		toggleLeftSidebar: noop,
	});
