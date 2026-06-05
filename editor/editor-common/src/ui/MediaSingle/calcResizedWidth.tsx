import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';

import { calcBreakoutWidth, calcWideWidth } from '../../utils/breakout';

/**
 * Calculates the image width for previously resized images.
 *
 * Wide and full-width images are always that size (960px and 100%); there is
 * no distinction between max-width and width.
 * @param layout
 * @param width
 * @param containerWidth
 * @example
 */
export function calcResizedWidth(
	layout: MediaSingleLayout,
	width: number,
	containerWidth: number = 0,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
	switch (layout) {
		case 'wide':
			return calcWideWidth(containerWidth);
		case 'full-width':
			return calcBreakoutWidth(layout, containerWidth);
		default:
			return `${width}px`;
	}
}
