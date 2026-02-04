import { type Context, createContext, type KeyboardEvent, type MouseEvent, useContext, useEffect } from 'react';

import noop from '@atlaskit/ds-lib/noop';

export type LeftSidebarState = {
	isFlyoutOpen: boolean;
	isResizing: boolean;
	isLeftSidebarCollapsed: boolean;
	leftSidebarWidth: number;
	lastLeftSidebarWidth: number;
	flyoutLockCount: number;
	isFixed: boolean;
	hasInit: boolean;
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SidebarResizeContext: Context<SidebarResizeContextValue> = createContext<SidebarResizeContextValue>({
	isLeftSidebarCollapsed: false,
	expandLeftSidebar: noop,
	collapseLeftSidebar: noop,
	leftSidebarState,
	setLeftSidebarState: noop,
	toggleLeftSidebar: noop,
});

export const usePageLayoutResize = (): {
    isLeftSidebarCollapsed: boolean; expandLeftSidebar: () => void; collapseLeftSidebar: (
        event?: MouseEvent | KeyboardEvent,
        collapseWithoutTransition?: boolean
    ) => void;
    /**
     * Conditionally expands or collapses the left sidebar based on the current state.
     * This is aware of our flyout mode in mobile as well.
     */
    toggleLeftSidebar: (
        event?: MouseEvent | KeyboardEvent,
        collapseWithoutTransition?: boolean
    ) => void; leftSidebarState: LeftSidebarState;
} => {
	const { setLeftSidebarState, ...context } = useContext(SidebarResizeContext);
	return context;
};

/**
 * _**WARNING:**_ This hook is intended as a temporary solution and
 * is likely to be removed in a future version of page-layout.
 *
 * ---
 *
 * This hook will prevent the left sidebar from automatically collapsing
 * when it is in a flyout state.
 *
 * The intended use case for this hook is to allow popup menus in the
 * left sidebar to be usable while it is in a flyout state.
 *
 * ## Usage
 * The intended usage is to use this hook within the popup component
 * you are rendering. This way the left sidebar will be locked for
 * as long as the popup is open.
 */
export const useLeftSidebarFlyoutLock = (): void => {
	const { setLeftSidebarState } = useContext(SidebarResizeContext);

	useEffect(() => {
		setLeftSidebarState((current) => ({
			...current,
			flyoutLockCount: current.flyoutLockCount + 1,
		}));
		return () => {
			setLeftSidebarState((current) => ({
				...current,
				flyoutLockCount: current.flyoutLockCount - 1,
			}));
		};
	}, [setLeftSidebarState]);
};
