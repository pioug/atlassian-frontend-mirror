import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { roundToNearest } from '../media-single';

import type { GuidelineConfig, RelativeGuides } from './types';
import { getMediaSingleDimensions } from './utils';

const RELATIVE_GUIDES_GAP = 6;

const getWidthRelativeGuideline = (
	key: string,
	view: EditorView,
	nodeWithPos: NodeWithPos,
	editorWidth: number,
	topOffset: number,
	size?: { width: number; height: number },
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): GuidelineConfig | null => {
	const { node, pos } = nodeWithPos;

	const { height: viewHeight } = view.dom.getBoundingClientRect();
	const { top } = view.coordsAtPos(pos + 1); // media node

	const { width, height } = size || getMediaSingleDimensions(node, editorWidth) || {};

	const y = top - topOffset - RELATIVE_GUIDES_GAP;

	if (!width || !height || y < 0 || y > viewHeight) {
		return null;
	}

	let start = 0;
	let end = 0;

	switch (node.attrs.layout) {
		case 'align-start':
		case 'wrap-left':
			start = -editorWidth / 2;
			end = start + width;
			break;
		case 'align-end':
		case 'wrap-right':
			end = editorWidth / 2;
			start = end - width;
			break;
		case 'center':
		case 'wide':
		case 'full-width':
			end = width / 2;
			start = -end;
			break;
		default:
	}

	return {
		key,
		position: {
			y,
			x: {
				start,
				end,
			},
		},
		active: true,
		styles: {
			lineStyle: 'dashed',
			capStyle: 'line',
		},
	};
};

const getHeightRelativeGuideline = (
	key: string,
	view: EditorView,
	nodeWithPos: NodeWithPos,
	editorWidth: number,
	topOffset: number,
	size?: { width: number; height: number },
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): GuidelineConfig | null => {
	const { node, pos } = nodeWithPos;
	const { height: viewHeight } = view.dom.getBoundingClientRect();
	const { top } = view.coordsAtPos(pos + 1); // media node

	const { width, height } = size || getMediaSingleDimensions(node, editorWidth) || {};

	if (!width || !height) {
		return null;
	}

	const start = top - topOffset;
	const end = start + height;

	if (end < 0 || start > viewHeight) {
		return null;
	}

	let x = 0;
	const halfWidth = editorWidth / 2;
	switch (node.attrs.layout) {
		case 'align-start':
		case 'wrap-left':
			x = width - halfWidth;
			break;
		case 'align-end':
		case 'wrap-right':
			x = halfWidth;
			break;
		case 'center':
		case 'wide':
		case 'full-width':
			x = width / 2;
			break;
		default:
			x = 0;
	}

	return {
		key,
		position: {
			x: x + RELATIVE_GUIDES_GAP,
			y: {
				start,
				end,
			},
		},
		active: true,
		styles: {
			lineStyle: 'dashed',
			capStyle: 'line',
		},
	};
};

export const getRelativeGuideSnaps = (
	relativeGuides: RelativeGuides,
	aspectRatio: number,
): number[] => {
	const snapsWidthFromMatchingHeight = Object.keys(relativeGuides.height || {}).map((heightKey) => {
		const height = Number.parseInt(heightKey);
		return roundToNearest(height * aspectRatio);
	});

	const snapsWidthFromMatchingWidth = Object.keys(relativeGuides.width || {}).map((widthKey) => {
		return Number.parseInt(widthKey);
	});

	return [...snapsWidthFromMatchingWidth, ...snapsWidthFromMatchingHeight];
};

export const getRelativeGuidelines = (
	relativeGuides: RelativeGuides,
	nodeWithPos: NodeWithPos,
	view: EditorView,
	editorWidth: number,
	topOffset: number,
	size: { width: number; height: number },
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const matchWidth = relativeGuides.width ? relativeGuides.width[Math.round(size.width)] : [];
	const matchHeight = relativeGuides.height ? relativeGuides.height[Math.round(size.height)] : [];
	const matches = matchWidth || matchHeight;

	const getRelativeGuideline =
		(matchWidth && getWidthRelativeGuideline) ||
		(matchHeight && getHeightRelativeGuideline) ||
		null;

	if (matches && getRelativeGuideline) {
		return [
			getRelativeGuideline(
				'relative_guide_current',
				view,
				nodeWithPos,
				editorWidth,
				topOffset,
				size,
			),
			...matches.map((nodeWithPos, index) => {
				return getRelativeGuideline(
					`relative_guide_${index}`,
					view,
					nodeWithPos,
					editorWidth,
					topOffset,
				);
			}),
		].filter((config): config is GuidelineConfig => !!config);
	}

	return [];
};
