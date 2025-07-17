import React, { Fragment, useMemo, useRef } from 'react';

import { PanelSplitterContext, type PanelSplitterContextType } from './context';

export type PanelSplitterProviderProps = Omit<
	PanelSplitterContextType,
	'portalRef' | 'position'
> & {
	children: React.ReactNode;
	position?: 'start' | 'end';
};

/**
 * Provides the context required for the panel splitter to work within a page layout slot.
 *
 * Should be used in the layout area components, e.g. SideNav, Aside etc, as opposed to products.
 */
export const PanelSplitterProvider = ({
	panelId,
	panelWidth,
	onCompleteResize,
	getResizeBounds,
	resizingCssVar,
	panelRef,
	position = 'end',
	isEnabled = true,
	children,
}: PanelSplitterProviderProps) => {
	const portalRef = useRef<HTMLDivElement | null>(null);

	const context: PanelSplitterContextType = useMemo(
		() => ({
			panelId,
			panelWidth,
			onCompleteResize,
			getResizeBounds,
			resizingCssVar,
			position,
			panelRef,
			isEnabled,
			portalRef,
		}),
		[
			panelId,
			panelWidth,
			onCompleteResize,
			getResizeBounds,
			resizingCssVar,
			position,
			portalRef,
			panelRef,
			isEnabled,
		],
	);

	return (
		<Fragment>
			<PanelSplitterContext.Provider value={context}>{children}</PanelSplitterContext.Provider>
			{/**
			 * Portal target for rendering the PanelSplitter.
			 * Rendered within a separate div so it doesn't impact the rest of the side nav layout.
			 */}
			<div ref={portalRef} />
		</Fragment>
	);
};
