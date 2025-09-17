import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getMediaSinglePixelWidth, roundToNearest } from '../media-single';

import type { GuidelineConfig, GuidelineTypes, Position, Range, VerticalPosition } from './types';

export const isNumber = (x: unknown): x is number =>
	typeof x === 'number' && !isNaN(x) && isFinite(x);

export const isRange = (range: unknown): range is Range =>
	!!(typeof range === 'object' && range && 'start' in range && 'end' in range);

export const isVerticalPosition = (pos: Position): pos is VerticalPosition => isNumber(pos.x);

/**
 * Returns the type of guideline based on a guideline key and a collection of guidelines
 */
export const getGuidelineTypeFromKey = (
	keys: string[],
	guidelines: GuidelineConfig[],
): GuidelineTypes => {
	if (guidelines.length === 0) {
		return 'none';
	}

	// Check for default guidelines on key
	if (
		keys.some((key) =>
			['grid_', 'wide_', 'full_width'].some(
				(defaultGuideline) => key.indexOf(defaultGuideline) >= 0,
			),
		)
	) {
		return 'default';
	}

	// Check for temporary guidelines
	if (
		keys.some((key) =>
			['media_'].some((temoporaryGuideline) => key.indexOf(temoporaryGuideline) >= 0),
		)
	) {
		return 'temporary';
	}

	// Check for relative guidelines
	if (
		keys.some((key) =>
			['relative_'].some((relativeGuideline) => key.indexOf(relativeGuideline) >= 0),
		)
	) {
		return 'relative';
	}

	return 'none';
};

/**
 * Calculates container or full editor width taking in account editor full width layout
 * width and editor gutter padding.
 */
export const getContainerWidthOrFullEditorWidth = (containerWidth: number) => {
	const padding =
		containerWidth <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
			? akEditorGutterPaddingReduced
			: akEditorGutterPaddingDynamic();

	return Math.min(containerWidth - padding * 2, akEditorFullWidthLayoutWidth) / 2;
};

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
