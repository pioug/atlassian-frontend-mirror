/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { akEditorBreakoutPadding } from '@atlaskit/editor-shared-styles';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getNodeAnchor } from '../pm-plugins/decorations-common';
import { useActiveAnchorTracker } from '../pm-plugins/utils/active-anchor-tracker';
import { type AnchorRectCache, isAnchorSupported } from '../pm-plugins/utils/anchor-utils';
import { getInsertLayoutStep, updateSelection } from '../pm-plugins/utils/update-selection';

import { type DropTargetProps } from './drop-target';

const HOVER_ZONE_WIDTH = '--editor-blocks-inline-hover-zone-width';
const HOVER_ZONE_HEIGHT = '--editor-blocks-inline-hover-zone-height';
const HOVER_ZONE_TOP = '--editor-blocks-inline-hover-zone-top';
const HOVER_ZONE_BOTTOM = '--editor-blocks-inline-hover-zone-bottom';
const HOVER_ZONE_ANCHOR_NAME = '--editor-blocks-inline-hover-zone-anchor-name';

const hoverZoneCommonStyle = css({
	position: 'absolute',
	// above the top and bottom drop zone as block hover zone
	zIndex: 120,
	positionAnchor: `var(${HOVER_ZONE_ANCHOR_NAME})`,
	minWidth: token('space.100', '8px'),
	left: 0,
	right: 0,
	width: `var(${HOVER_ZONE_WIDTH})`,
	height: `var(${HOVER_ZONE_HEIGHT})`,
});

const leftHoverZoneStyle = css({
	right: `unset`,
	top: `var(${HOVER_ZONE_TOP})`,
	bottom: 'unset',
});

const rightHoverZoneStyle = css({
	left: `unset`,
	top: 'unset',
	bottom: `var(${HOVER_ZONE_BOTTOM})`,
});

// gap between node boundary and drop indicator/drop zone
const GAP = 4;

const dropTargetLayoutHintStyle = css({
	height: '100%',
	position: 'absolute',
	borderRight: `1px dashed ${token('color.border.focused', B200)}`,
	width: 0,
	left: 0,
});

const dropTargetLayoutHintLeftStyle = css({
	left: 'unset',
	right: 0,
});

type NodeDimensionType = {
	width: string;
	height: string;
	top: string;
	bottom: string;
	widthOffset?: string;
};

const defaultNodeDimension = {
	width: '0',
	height: '0',
	top: 'unset',
	bottom: 'unset',
};

const getWidthOffset = (node: PMNode, width: string, position: 'left' | 'right') => {
	if (
		['mediaSingle', 'table', 'embedCard'].includes(node.type.name) ||
		// block card (without datasource) is positioned left-aligned, hence share the same logic as align-start
		(node.type.name === 'blockCard' && !node.attrs.datasource)
	) {
		const isLeftPosition = position === 'left';
		if (node.attrs.layout === 'align-start' || node.type.name === 'blockCard') {
			return isLeftPosition
				? `-0.5*(var(--ak-editor--line-length) - ${width})`
				: `0.5*(var(--ak-editor--line-length) - ${width})`;
		} else if (node?.attrs.layout === 'align-end') {
			return isLeftPosition
				? `0.5*(var(--ak-editor--line-length) - ${width})`
				: `-0.5*(var(--ak-editor--line-length) - ${width})`;
		}
	}

	if (node.type.name === 'bodiedExtension' || node.type.name === 'extension') {
		return '-12px';
	}
};

const TABLE_NUMBERED_COLUMN_WIDTH = 42;

export const InlineDropTarget = ({
	api,
	nextNode,
	position,
	anchorRectCache,
	getPos,
}: DropTargetProps & {
	anchorRectCache?: AnchorRectCache;
	position: 'left' | 'right';
}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const anchorName = useMemo(() => {
		return nextNode ? getNodeAnchor(nextNode) : '';
	}, [nextNode]);

	const [isActiveAnchor] = useActiveAnchorTracker(anchorName);

	const isLeftPosition = position === 'left';

	const nodeDimension: NodeDimensionType = useMemo(() => {
		if (!nextNode) {
			return defaultNodeDimension;
		}
		let innerContainerWidth: string | null = null;
		let targetAnchorName = anchorName;
		if (['blockCard', 'embedCard', 'extension'].includes(nextNode.type.name)) {
			if (nextNode.attrs.layout === 'wide') {
				innerContainerWidth = `max(var(--ak-editor--legacy-breakout-wide-layout-width), var(--ak-editor--line-length))`;
			} else if (nextNode.attrs.layout === 'full-width') {
				innerContainerWidth = `min(calc(100cqw - ${akEditorBreakoutPadding}px), 1800px)`;
			}

			if (
				nextNode.type.name === 'blockCard' &&
				!nextNode.attrs.layout &&
				nextNode.attrs.datasource
			) {
				// block card with sourceNode and without layout has different width in full-width vs fixed-width editor
				// Hence we need to set it based on editor mode
				innerContainerWidth = 'var(--ak-editor-block-card-width)';
			}

			if (
				nextNode.type.name === 'embedCard' &&
				['center', 'align-start', 'align-end'].includes(nextNode.attrs.layout)
			) {
				const percentageWidth = ((parseFloat(nextNode.attrs.width) || 100) / 100).toFixed(2);
				innerContainerWidth = `calc(var(--ak-editor--line-length) * ${percentageWidth})`;
			}
		} else if (nextNode.type.name === 'table' && nextNode.firstChild) {
			const tableWidthAnchor = getNodeAnchor(nextNode.firstChild);
			const isNumberColumnEnabled = Boolean(nextNode.attrs.isNumberColumnEnabled);
			if (isAnchorSupported()) {
				innerContainerWidth = isNumberColumnEnabled
					? `calc(anchor-size(${tableWidthAnchor} width) + ${TABLE_NUMBERED_COLUMN_WIDTH}px)`
					: `anchor-size(${tableWidthAnchor} width)`;
			} else {
				innerContainerWidth = `${(anchorRectCache?.getRect(tableWidthAnchor)?.width || 0) + TABLE_NUMBERED_COLUMN_WIDTH}px`;
			}

			if (nextNode.attrs.width) {
				// when the table has horizontal scroll
				innerContainerWidth = `min(${nextNode.attrs.width}px, ${innerContainerWidth})`;
			}
		} else if (nextNode.type.name === 'mediaSingle' && nextNode.firstChild) {
			targetAnchorName = getNodeAnchor(nextNode.firstChild);
		}

		// Set the height target anchor name to the first or last column of the layout section so that it also works for stacked layout
		let heightTargetAnchorName = targetAnchorName;
		if (nextNode.type.name === 'layoutSection' && nextNode.firstChild && nextNode.lastChild) {
			heightTargetAnchorName = isLeftPosition
				? getNodeAnchor(nextNode.firstChild)
				: getNodeAnchor(nextNode.lastChild);
		}

		if (isAnchorSupported()) {
			const width = innerContainerWidth || `anchor-size(${targetAnchorName} width)`;
			const height = `anchor-size(${heightTargetAnchorName} height)`;

			return {
				width,
				height,
				top: 'anchor(top)',
				bottom: 'anchor(bottom)',
				widthOffset: getWidthOffset(nextNode, width, position),
			};
		}
		if (anchorRectCache) {
			const nodeRect = anchorRectCache.getRect(targetAnchorName);
			const width = innerContainerWidth || `${nodeRect?.width || 0}px`;
			const top = nodeRect?.top ? `${nodeRect?.top}px` : 'unset';
			const bottom = `100% - ${nodeRect?.bottom || 0}px + ${GAP}px`;
			let height = `${nodeRect?.height || 0}px`;

			if (heightTargetAnchorName !== targetAnchorName) {
				const nodeHeightRect = anchorRectCache.getRect(heightTargetAnchorName);
				height = `${nodeHeightRect?.height || 0}px + ${GAP}px`;
			}
			return {
				width,
				height,
				top,
				bottom,
				widthOffset: getWidthOffset(nextNode, width, position),
			};
		}

		return defaultNodeDimension;
	}, [anchorName, anchorRectCache, nextNode, position, isLeftPosition]);

	const onDrop = useCallback(() => {
		const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
		if (!activeNode) {
			return;
		}

		const toPos = getPos();
		let mappedTo: number | undefined;
		if (activeNode && toPos !== undefined) {
			const { pos: start } = activeNode;

			const moveToEnd = position === 'right';
			api?.core?.actions.execute(({ tr }) => {
				api?.blockControls?.commands?.moveToLayout(start, toPos, {
					moveToEnd,
				})({ tr });

				const insertLayoutStep = getInsertLayoutStep(tr);
				mappedTo = (insertLayoutStep as ReplaceStep)?.from;

				return tr;
			});

			api?.core?.actions.execute(({ tr }) => {
				if (mappedTo !== undefined) {
					updateSelection(tr, mappedTo, moveToEnd);
				}
				return tr;
			});
		}
	}, [api, getPos, position]);

	const hoverZoneRectStyle = useMemo(() => {
		const isLayoutNode = nextNode?.type.name === 'layoutSection';
		const layoutAdjustment = isLayoutNode ? { width: 11, height: 4, top: 6, bottom: 2 } : undefined;

		return {
			[HOVER_ZONE_WIDTH]: nodeDimension.widthOffset
				? `calc((100% - ${nodeDimension.width})/2 - ${GAP}px + ${nodeDimension.widthOffset} - ${layoutAdjustment?.width || 0}px)`
				: `calc((100% - ${nodeDimension.width})/2 - ${GAP}px - ${layoutAdjustment?.width || 0}px)`,
			[HOVER_ZONE_HEIGHT]: `calc(${nodeDimension.height} + ${layoutAdjustment?.height || 0}px)`,
			[HOVER_ZONE_TOP]: `calc(${nodeDimension.top} + ${layoutAdjustment?.top || 0}px)`,
			[HOVER_ZONE_BOTTOM]: `calc(${nodeDimension.bottom} - ${layoutAdjustment?.bottom || 0}px)`,
			[HOVER_ZONE_ANCHOR_NAME]: anchorName,
		} as CSSProperties;
	}, [nextNode?.type.name, nodeDimension, anchorName]);

	const dropIndicatorPos = useMemo(() => {
		return isLeftPosition ? 'right' : 'left';
	}, [isLeftPosition]);

	useEffect(() => {
		if (ref.current) {
			return dropTargetForElements({
				element: ref.current,
				onDragEnter: () => {
					setIsDraggedOver(true);
				},
				onDragLeave: () => {
					setIsDraggedOver(false);
				},
				onDrop,
			});
		}
	}, [onDrop, setIsDraggedOver]);

	return (
		<div
			ref={ref}
			data-testid={`drop-target-hover-zone-${position}`}
			css={[hoverZoneCommonStyle, isLeftPosition ? leftHoverZoneStyle : rightHoverZoneStyle]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={hoverZoneRectStyle}
		>
			{isDraggedOver ? (
				<DropIndicator edge={dropIndicatorPos} />
			) : (
				isActiveAnchor && (
					<div
						data-testid="block-ctrl-drop-hint"
						css={[dropTargetLayoutHintStyle, isLeftPosition && dropTargetLayoutHintLeftStyle]}
					/>
				)
			)}
		</div>
	);
};
