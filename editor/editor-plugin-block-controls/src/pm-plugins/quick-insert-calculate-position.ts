import { type CSSProperties } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import {
	rootElementGap,
	topPositionAdjustment,
	QUICK_INSERT_DIMENSIONS,
	QUICK_INSERT_LEFT_OFFSET,
} from '../ui/consts';
import { refreshAnchorName } from '../ui/utils/anchor-name';

import { type AnchorRectCache } from './utils/anchor-utils';
import {
	getControlBottomCSSValue,
	getControlHeightCSSValue,
	getNodeHeight,
	getTopPosition,
	shouldBeSticky,
} from './utils/drag-handle-positions';
import { getLeftPositionForRootElement } from './utils/widget-positions';

// Adapted from `src/ui/drag-handle.tsx` as positioning logic is similar
// CHANGES - added an offset so quick insert button can be positioned beside drag handle
// CHANGES - removed `editorExperiment('nested-dnd', true)` check and rootNodeType calculation
// CHANGES - replace anchorName with rootAnchorName
// CHANGES - `removed editorExperiment('advanced_layouts', true) && isLayoutColumn` checks as quick insert button will not be positioned for layout column
export const calculatePosition = ({
	rootAnchorName,
	anchorName,
	view,
	getPos,
	rootNodeType,
	macroInteractionUpdates,
	anchorRectCache,
}: {
	anchorName: string;
	anchorRectCache: AnchorRectCache | undefined;
	getPos: () => number | undefined;
	macroInteractionUpdates: boolean | undefined;
	rootAnchorName: string | undefined;
	rootNodeType: string;
	view: EditorView;
}): CSSProperties => {
	const supportsAnchor =
		CSS.supports('top', `anchor(${rootAnchorName} start)`) &&
		CSS.supports('left', `anchor(${rootAnchorName} start)`);

	const safeAnchorName = refreshAnchorName({ getPos, view, anchorName: rootAnchorName });

	const dom: HTMLElement | null = view.dom.querySelector(
		`[data-drag-handler-anchor-name="${safeAnchorName}"]`,
	);

	const hasResizer = rootNodeType === 'table' || rootNodeType === 'mediaSingle';
	const isExtension = rootNodeType === 'extension' || rootNodeType === 'bodiedExtension';
	const isBlockCard = rootNodeType === 'blockCard';
	const isEmbedCard = rootNodeType === 'embedCard';

	const isMacroInteractionUpdates = macroInteractionUpdates && isExtension;

	let innerContainer: HTMLElement | null = null;
	if (dom) {
		if (isEmbedCard) {
			innerContainer = dom.querySelector('.rich-media-item');
		} else if (hasResizer) {
			innerContainer = dom.querySelector('.resizer-item');
		} else if (isExtension) {
			innerContainer = dom.querySelector('.extension-container[data-layout]');
		} else if (isBlockCard) {
			//specific to datasource blockCard
			innerContainer = dom.querySelector('.datasourceView-content-inner-wrap');
		}
	}

	const isEdgeCase = (hasResizer || isExtension || isEmbedCard || isBlockCard) && innerContainer;
	const isSticky = shouldBeSticky(rootNodeType);
	const bottom = getControlBottomCSSValue(safeAnchorName || anchorName, isSticky, true);

	if (supportsAnchor) {
		return {
			left: isEdgeCase
				? `calc(anchor(${safeAnchorName} start) + ${getLeftPositionForRootElement(dom, rootNodeType, QUICK_INSERT_DIMENSIONS, innerContainer, isMacroInteractionUpdates)} + -${QUICK_INSERT_LEFT_OFFSET}px)`
				: `calc(anchor(${safeAnchorName} start) - ${QUICK_INSERT_DIMENSIONS.width}px - ${rootElementGap(rootNodeType)}px + -${QUICK_INSERT_LEFT_OFFSET}px)`,

			top: `calc(anchor(${safeAnchorName} start) + ${topPositionAdjustment(rootNodeType)}px)`,
			...bottom,
		} as CSSProperties;
	}

	// expensive, calls offsetHeight
	const nodeHeight = getNodeHeight(dom, safeAnchorName || anchorName, anchorRectCache) || 0;

	const height = getControlHeightCSSValue(nodeHeight, isSticky, true, token('space.300'));

	return {
		left: isEdgeCase
			? `calc(${dom?.offsetLeft || 0}px + ${getLeftPositionForRootElement(dom, rootNodeType, QUICK_INSERT_DIMENSIONS, innerContainer, isMacroInteractionUpdates)} + -${QUICK_INSERT_LEFT_OFFSET}px)`
			: `calc(${getLeftPositionForRootElement(
					dom,
					rootNodeType,
					QUICK_INSERT_DIMENSIONS,
					innerContainer,
					isMacroInteractionUpdates,
				)} + -${QUICK_INSERT_LEFT_OFFSET}px)`,
		top: getTopPosition(dom, rootNodeType),
		...height,
	} as CSSProperties;
};
