import React, { Fragment, type MutableRefObject, useMemo, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { PanelSplitterContext, type PanelSplitterContextType } from './context';

export type PanelSplitterProviderProps = Omit<
	PanelSplitterContextType,
	// Omitting these types to make them optional
	'portalRef' | 'position'
> & {
	children: React.ReactNode;
	/**
	 * The side of the panel/element that the splitter element is positioned on. Uses logical values to support right-to-left languages.
	 *
	 * Defaults to `start`.
	 *
	 * For left-to-right languages, `start` is the left side and `end` is the right side.
	 */
	position?: 'start' | 'end';

	/**
	 * A ref to the portal element where the panel splitter will be rendered.
	 * It can optionally be provided by consumers of <PanelSplitterProvider> (when the feature gate
	 * `platform-dst-side-nav-layering-fixes` is enabled).
	 * If not provided, it will be internally set by the PanelSplitterProvider.
	 *
	 * This prop is useful for:
	 * - Rendering the panel splitter outside of an overflow container.
	 * - Positioning the panel splitter outside the resizing panel.
	 */
	portalRef?: MutableRefObject<HTMLDivElement | null>;
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
	portalRef: providedPortalRef,
	position = 'end',
	isEnabled = true,
	shortcut,
	children,
}: PanelSplitterProviderProps): React.JSX.Element => {
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
			portalRef:
				typeof providedPortalRef !== 'undefined' && fg('platform-dst-side-nav-layering-fixes')
					? providedPortalRef
					: portalRef,
			shortcut,
		}),
		[
			panelId,
			panelWidth,
			onCompleteResize,
			getResizeBounds,
			resizingCssVar,
			position,
			panelRef,
			isEnabled,
			providedPortalRef,
			shortcut,
		],
	);

	return (
		<Fragment>
			<PanelSplitterContext.Provider value={context}>{children}</PanelSplitterContext.Provider>
			{/**
			 * Portal target for rendering the PanelSplitter.
			 * Rendered within a separate div so it doesn't impact the rest of the side nav layout.
			 */}
			{typeof providedPortalRef !== 'undefined' &&
			fg('platform-dst-side-nav-layering-fixes') ? null : (
				<div ref={portalRef} />
			)}
		</Fragment>
	);
};
