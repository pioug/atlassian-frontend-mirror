import React, { type ReactNode, useContext } from 'react';

import invariant from 'tiny-invariant';

import { sideNavPanelSplitterId } from '../constants';
import { useToggleSideNav } from '../side-nav/use-toggle-side-nav';

import { OnDoubleClickContext, PanelSplitterContext } from './context';
import { PanelSplitter, type PanelSplitterProps } from './panel-splitter';

type SideNavPanelSplitterProps = Omit<PanelSplitterProps, 'onDoubleClick'> & {
	shouldCollapseOnDoubleClick?: boolean;
};

/**
 * _SideNavPanelSplitter_
 *
 * A component that allows the user to resize or collapse the side nav.
 * It must be used within the `SideNav` layout area.
 *
 * Example usage:
 * ```tsx
 * <SideNav>
 *   <SideNavPanelSplitter label="Resize or collapse Side Nav"  />
 * </SideNav>
 * ```
 */
export const SideNavPanelSplitter = ({
	label,
	onResizeStart,
	onResizeEnd,
	testId,
	shouldCollapseOnDoubleClick = true,
}: SideNavPanelSplitterProps): ReactNode => {
	const context = useContext(PanelSplitterContext);
	invariant(
		context?.panelId === sideNavPanelSplitterId,
		'SideNavPanelSplitter must be rendered as a child of <SideNav />.',
	);
	const toggleSideNav = useToggleSideNav();

	return (
		<OnDoubleClickContext.Provider value={shouldCollapseOnDoubleClick ? toggleSideNav : undefined}>
			<PanelSplitter
				label={label}
				onResizeStart={onResizeStart}
				onResizeEnd={onResizeEnd}
				testId={testId}
			/>
		</OnDoubleClickContext.Provider>
	);
};
