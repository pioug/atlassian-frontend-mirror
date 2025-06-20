import { createContext, type MutableRefObject } from 'react';

import { type ResizeBounds } from './types';

// Disabling the rule to allow for `Type` suffix, to differentiate from the Context object.
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type PanelSplitterContextType = {
	/**
	 * An optional identifier for the panel splitter, which is attached to the `pragmatic-drag-and-drop` drag data.
	 */
	panelId?: symbol;
	/**
	 * A ref to the page layout element that will be resized by the splitter.
	 */
	panelRef: MutableRefObject<HTMLDivElement | null>;
	/**
	 * The "saved" width of the panel element. Used to calculate the new width of the panel when dragging.
	 */
	panelWidth: number;
	/**
	 * Called when the user finishes resizing the panel. It should update the width of the panel element.
	 */
	onCompleteResize: (newWidth: number) => void;
	/**
	 * The minimum and maximum bounds for resizing the panel.
	 * The bounds can be provided as `px` or `vw` values.
	 */
	getResizeBounds: () => ResizeBounds;
	/**
	 * A ref to the portal element where the panel splitter will be rendered.
	 * Internally set by the PanelSplitterProvider.
	 * Used to render the panel splitter outside of an overflow container.
	 */
	portalRef: MutableRefObject<HTMLDivElement | null>;
	/**
	 * The CSS variable that will be set on the panel element to temporarily resize it while dragging the splitter
	 */
	resizingCssVar: string;
	/**
	 * The side of the panel/element that the splitter element is positioned on. Uses logical values to support right-to-left languages.
	 *
	 * Defaults to `start`.
	 *
	 * For left-to-right languages, `start` is the left side and `end` is the right side.
	 */
	position: 'start' | 'end';

	/**
	 * Whether the panel splitter is enabled and should be rendered.
	 *
	 * Defaults to `true`.
	 * If `false`, the panel splitter will not be rendered.
	 */
	isEnabled?: boolean;
};

/**
 * Context for the panel splitter. Only internally exported.
 */
export const PanelSplitterContext = createContext<PanelSplitterContextType | null>(null);
