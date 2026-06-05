import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

import { getMediaSinglePixelWidth, roundToNearest } from '../media-single';

/**
 *
 * @param mediaSingle the mediaSingle node
 * @param editorWidth default 760, only use default if the mediaSingle is using pixel width
 * @returns null or dimensions info
 */
export const getMediaSingleDimensions = (
	mediaSingle: PMNode,
	editorWidth: number = akEditorDefaultLayoutWidth,
): {
	height: number;
	originalHeight: number;
	originalWidth: number;
	ratio: number;
	width: number;
} | null => {
	if (mediaSingle.type !== mediaSingle.type.schema.nodes.mediaSingle) {
		return null;
	}

	const mediaNode = mediaSingle.firstChild;
	const { width, height } = mediaNode?.attrs || {};

	// e.g. external image
	if (!width || !height) {
		return null;
	}

	const ratio = parseFloat((height / width).toFixed(2));

	if (!mediaSingle.attrs.width) {
		return {
			width,
			height,
			originalWidth: width,
			originalHeight: height,
			ratio,
		};
	}

	const pixelWidth = getMediaSinglePixelWidth(
		mediaSingle.attrs.width,
		editorWidth,
		mediaSingle.attrs.widthType,
	);

	return {
		width: roundToNearest(pixelWidth),
		height: roundToNearest(pixelWidth * ratio),
		originalWidth: width,
		originalHeight: height,
		ratio,
	};
};
