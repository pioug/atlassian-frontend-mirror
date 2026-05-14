import { type KeyboardEvent, type MouseEvent, useContext } from 'react';

import { SidebarResizeContext } from './sidebar-resize-context';
import { type LeftSidebarState } from './types';

/**
 * @deprecated `@atlaskit/page-layout` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export const usePageLayoutResize = (): {
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
} => {
	const { setLeftSidebarState, ...context } = useContext(SidebarResizeContext);
	return context;
};
