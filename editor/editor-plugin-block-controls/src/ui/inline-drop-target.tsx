/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { getNodeAnchor } from '../pm-plugins/decorations-common';
import { useActiveAnchorTracker } from '../utils/active-anchor-tracker';
import { type AnchorRectCache, isAnchorSupported } from '../utils/anchor-utils';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';

import { type DropTargetProps } from './drop-target';

const hoverZoneCommonStyle = css({
	position: 'absolute',
	// above the top and bottom drop zone as block hover zone
	zIndex: 120,
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
	widthOffset?: string;
};

const defaultNodeDimension = {
	width: '0',
	height: '0',
	top: 'unset',
};

const getWidthOffset = (node: PMNode, width: string, position: 'left' | 'right') => {
	if (node.type.name === 'mediaSingle' || node.type.name === 'table') {
		const isLeftPosition = position === 'left';
		if (node.attrs.layout === 'align-start') {
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

		if (['blockCard', 'embedCard'].includes(nextNode.type.name)) {
			if (nextNode.attrs.layout === 'wide') {
				innerContainerWidth = `max(var(--ak-editor--legacy-breakout-wide-layout-width), var(--ak-editor--line-length))`;
			} else if (nextNode.attrs.layout === 'full-width') {
				innerContainerWidth =
					'max(calc(var(--ak-editor-max-container-width) - var(--ak-editor--default-gutter-padding) * 2), var(--ak-editor--line-length))';
			}
		} else if (nextNode.type.name === 'table' && nextNode.firstChild) {
			const tableWidthAnchor = getNodeAnchor(nextNode.firstChild);
			innerContainerWidth = isAnchorSupported()
				? `anchor-size(${tableWidthAnchor} width)`
				: `${anchorRectCache?.getRect(tableWidthAnchor)?.width || 0}px`;
			if (nextNode.attrs.width) {
				// when the table has horizontal scroll
				innerContainerWidth = `min(${nextNode.attrs.width}px, ${innerContainerWidth})`;
			}
		} else if (nextNode.type.name === 'mediaSingle' && nextNode.firstChild) {
			targetAnchorName = getNodeAnchor(nextNode.firstChild);
		}

		if (isAnchorSupported()) {
			const width = innerContainerWidth || `anchor-size(${targetAnchorName} width)`;
			const height = `anchor-size(${targetAnchorName} height)`;

			return {
				width,
				height,
				top: 'anchor(top)',
				widthOffset: getWidthOffset(nextNode, width, position),
			};
		}

		if (anchorRectCache) {
			const nodeRect = anchorRectCache.getRect(targetAnchorName);
			const width = innerContainerWidth || `${nodeRect?.width || 0}px`;
			const top = nodeRect?.top ? `${nodeRect?.top}px` : 'unset';
			const height = `${nodeRect?.height || 0}px`;

			return {
				width,
				height,
				top,
				widthOffset: getWidthOffset(nextNode, width, position),
			};
		}

		return defaultNodeDimension;
	}, [anchorName, anchorRectCache, nextNode, position]);

	const onDrop = useCallback(() => {
		const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
		if (!activeNode) {
			return;
		}

		const toPos = getPos();
		if (activeNode && toPos !== undefined) {
			const { pos: start } = activeNode;
			api?.core?.actions.execute(
				api?.blockControls?.commands?.moveToLayout(start, toPos, {
					moveToEnd: position === 'right',
				}),
			);
		}
	}, [api, getPos, position]);

	const inlineHoverZoneRectStyle = useMemo(() => {
		return css({
			positionAnchor: anchorName,
			minWidth: token('space.100', '8px'),
			left: isLeftPosition ? 0 : 'unset',
			right: isLeftPosition ? 'unset' : 0,
			top: `calc(anchor(top))`,
			width: nodeDimension.widthOffset
				? `calc((100% - ${nodeDimension.width})/2 - ${GAP}px + ${nodeDimension.widthOffset})`
				: `calc((100% - ${nodeDimension.width})/2 - ${GAP}px)`,
			height: `calc(${nodeDimension.height})`,
		});
	}, [anchorName, isLeftPosition, nodeDimension]);

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
			css={[hoverZoneCommonStyle, inlineHoverZoneRectStyle]}
		>
			{isDraggedOver || isBlocksDragTargetDebug() ? (
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
