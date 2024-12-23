import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findChildren } from '@atlaskit/editor-prosemirror/utils';

import { roundToNearest } from '../media-single';

import { MEDIA_DYNAMIC_GUIDELINE_PREFIX } from './constants';
import type { GuidelineConfig, GuidelineStyles, RelativeGuides } from './types';
import { getMediaSingleDimensions } from './utils';

export const generateDynamicGuidelines = (
	state: EditorState,
	editorWidth: number,
	styles: GuidelineStyles = {},
): {
	dynamicGuides: GuidelineConfig[];
	relativeGuides: RelativeGuides;
} => {
	const selectedNode =
		state.selection instanceof NodeSelection && (state.selection as NodeSelection).node;

	const offset = editorWidth / 2;

	return findChildren(
		state.tr.doc,
		(node: PMNode) => node.type === state.schema.nodes.mediaSingle,
	).reduce<{
		dynamicGuides: GuidelineConfig[];
		relativeGuides: RelativeGuides;
	}>(
		(acc, nodeWithPos, index) => {
			const { node, pos } = nodeWithPos;

			// if the current node the selected node
			// or the node is not using pixel width,
			// We will skip the node.
			if (selectedNode === node || node.attrs.widthType !== 'pixel') {
				return acc;
			}

			const $pos = state.tr.doc.resolve(pos);

			if ($pos.parent.type !== state.schema.nodes.doc) {
				return acc;
			}

			const dimensions = getMediaSingleDimensions(node, editorWidth);

			if (!dimensions) {
				return acc;
			}

			const { width, height } = dimensions;

			const dynamicGuides = [
				...acc.dynamicGuides,
				...getDynamicGuides(
					node.attrs.layout,
					width,
					offset,
					`${MEDIA_DYNAMIC_GUIDELINE_PREFIX}${index}`,
					styles,
				),
			];

			const accRelativeGuidesWidth = acc.relativeGuides?.width || {};
			const accRelativeGuidesHeight = acc.relativeGuides?.height || {};

			const relativeGuidesWidth = {
				...accRelativeGuidesWidth,
				[width]: [...(accRelativeGuidesWidth[width] || []), nodeWithPos],
			};

			const relativeGuidesWidthHeight = {
				...accRelativeGuidesHeight,
				[Math.round(height)]: [...(accRelativeGuidesHeight[height] || []), nodeWithPos],
			};

			return {
				dynamicGuides,
				relativeGuides: {
					width: relativeGuidesWidth,
					height: relativeGuidesWidthHeight,
				},
			};
		},
		{
			relativeGuides: {
				width: {},
				height: {},
			},
			dynamicGuides: [],
		},
	);
};

const getDynamicGuides = (
	layout: string,
	width: number,
	offset: number,
	key: string,
	styles: GuidelineStyles,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): GuidelineConfig[] => {
	switch (layout) {
		case 'align-start':
		case 'wrap-left':
			return [
				{
					position: { x: roundToNearest(width - offset) },
					key,
					...styles,
				},
			];
		case 'align-end':
		case 'wrap-right':
			return [
				{
					position: { x: roundToNearest(offset - width) },
					key,
					...styles,
				},
			];
		case 'center':
			return [
				{
					position: { x: roundToNearest(width / 2) },
					key: `${key}_right`,
					...styles,
				},
				{
					position: { x: -roundToNearest(width / 2) },
					key: `${key}_left`,
					...styles,
				},
			];
		default:
			return [];
	}
};
