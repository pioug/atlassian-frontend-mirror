import type { ReactNode } from 'react';

/**
 * Layout size bucket derived from the carousel container's pixel dimensions
 * via ResizeObserver (replaces CSS @container queries which are lint-blocked).
 *
 *  full    — wide (> 400px) AND tall (> 140px): two-column layout with image panel
 *  compact — medium width/height: image hidden, button moves above title
 *  minimal — very small: description + dots hidden, button only
 */
export type CarouselSize = 'full' | 'compact' | 'minimal';

export type CarouselItem = {
	/**
	 * Body text describing the benefit.
	 * Pass a plain string for static copy, or a function that receives the
	 * provider name (e.g. "Google Drive") and returns the final string.
	 */
	description: string;
	/** Large hero image — either a React element (e.g. SVG) or an image URL */
	image: ReactNode | string;
	/**
	 * Title of the teaser slide.
	 * Pass a plain string for static copy, or a function that receives the
	 * provider name (e.g. "Google Drive") and returns the final string.
	 */
	title: string;
};
