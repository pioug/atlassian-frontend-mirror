import React, { type ReactNode, useContext } from 'react';

import invariant from 'tiny-invariant';

import { sideNavPanelSplitterId } from '../constants';
import { useToggleSideNav } from '../side-nav/use-toggle-side-nav';

import { OnDoubleClickContext, PanelSplitterContext } from './context';
import { PanelSplitter, type PanelSplitterProps } from './panel-splitter';

type SideNavPanelSplitterProps = Omit<
	PanelSplitterProps,
	| 'onDoubleClick'
	// Omitting tooltipContent so we can add custom JSDocs
	| 'tooltipContent'
> & {
	/**
	 * Whether the side nav should collapse on double click.
	 *
	 * If not provided, it will default to `true`.
	 */
	shouldCollapseOnDoubleClick?: boolean;
	/**
	 * Displays a tooltip with the provided content. It is expected to be a string that explains the double click to collapse interaction.
	 *
	 * It will only be displayed if the `shouldCollapseOnDoubleClick` prop is `true`, or not provided (as it defaults to `true`).
	 *
	 * The `tooltipContent` will not be announced by screen readers because it pertains to the draggable element, which lacks keyboard functionality.
	 * Use the `label` prop to provide accessible information about the panel splitter.
	 *
	 * If the `isSideNavShortcutEnabled` prop is enabled on `<Root />`, the built-in keyboard shortcut will be displayed with the tooltip.
	 *
	 * Only used if `useIsFhsEnabled` is true.
	 */
	tooltipContent?: PanelSplitterProps['tooltipContent'];
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
 *   <SideNavPanelSplitter label="Double click to collapse"  />
 * </SideNav>
 * ```
 */
export const SideNavPanelSplitter = ({
	label,
	onResizeStart,
	onResizeEnd,
	testId,
	shouldCollapseOnDoubleClick = true,
	tooltipContent,
}: SideNavPanelSplitterProps): ReactNode => {
	const context = useContext(PanelSplitterContext);
	invariant(
		context?.panelId === sideNavPanelSplitterId,
		'SideNavPanelSplitter must be rendered as a child of <SideNav />.',
	);
	const toggleSideNav = useToggleSideNav({ trigger: 'double-click' });

	return (
		<OnDoubleClickContext.Provider value={shouldCollapseOnDoubleClick ? toggleSideNav : undefined}>
			<PanelSplitter
				label={label}
				onResizeStart={onResizeStart}
				onResizeEnd={onResizeEnd}
				testId={testId}
				tooltipContent={
					// Only displaying the tooltip if double click to collapse is enabled.
					// Otherwise, we would be displaying a tooltip with "Double click to collapse", when it actually won't.
					shouldCollapseOnDoubleClick ? tooltipContent : undefined
				}
			/>
		</OnDoubleClickContext.Provider>
	);
};
