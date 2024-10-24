/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { type EditorContainerWidth } from '@atlaskit/editor-common/src/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { getNodeAnchor } from '../pm-plugins/decorations';
import { type AnchorRectCache, isAnchorSupported } from '../utils/anchor-utils';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';

import { type DropTargetProps } from './drop-target';

const dropTargetCommonStyle = css({
	position: 'absolute',
	display: 'block',
});

const hoverZoneCommonStyle = css({
	position: 'absolute',
	// above the top and bottom drop zone as block hover zone
	zIndex: 120,
});

// gap between node boundary and drop indicator/drop zone
const GAP = 4;
const HOVER_ZONE_WIDTH_OFFSET = 40;
const HOVER_ZONE_HEIGHT_OFFSET = 10;
const HOVER_ZONE_DEFAULT_WIDTH = 40;

type DropTargetOffsets = {
	left: number;
	right: number;
};

const getDropTargetPositionOverride = (node?: PMNode, editorWidth?: number): DropTargetOffsets => {
	if (!node || !editorWidth) {
		return { left: 0, right: 0 };
	}

	const getOffsets = (nodeWidth: number) => {
		const offset = (editorWidth - nodeWidth) / 2;
		return { left: offset, right: offset };
	};

	if (node?.type.name === 'table' && node.attrs.width) {
		return getOffsets(node.attrs.width);
	}

	// media single 🤦
	if (node?.type.name === 'mediaSingle') {
		let mediaNodeWidth = 0;
		if (node.attrs.width) {
			if (node.attrs.widthType === 'pixel') {
				mediaNodeWidth = node.attrs.width;
			} else if (editorWidth) {
				mediaNodeWidth = (node.attrs.width / 100) * editorWidth;
			}
		} else {
			// use media width
			const mediaNode = node.firstChild;
			if (mediaNode && mediaNode.attrs.width) {
				mediaNodeWidth = mediaNode.attrs.width;
			}
		}

		if (mediaNodeWidth) {
			if (node.attrs.layout === 'align-start') {
				return { left: 0, right: editorWidth - mediaNodeWidth };
			} else if (node.attrs.layout === 'align-end') {
				return { left: editorWidth - mediaNodeWidth, right: 0 };
			}

			return getOffsets(mediaNodeWidth);
		}
	}

	return { left: 0, right: 0 };
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
	const { widthState } = useSharedPluginState(api, ['width']);
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const anchorName = nextNode ? getNodeAnchor(nextNode) : '';

	const handleDragEnter = useCallback(() => {
		setIsDraggedOver(true);
	}, []);

	const handleDragLeave = useCallback(() => {
		setIsDraggedOver(false);
	}, []);

	const offsets = useMemo(() => {
		return getDropTargetPositionOverride(nextNode, widthState?.lineLength);
	}, [nextNode, widthState]);

	const dropTargetRectStyle = useMemo(() => {
		if (isAnchorSupported()) {
			return css({
				height: `calc(anchor-size(${anchorName} height))`,
				positionAnchor: anchorName,
				left:
					position === 'left'
						? `calc(anchor(left) - ${GAP - offsets.left}px)`
						: `calc(anchor(right) + ${GAP - offsets.right}px)`,
				top: `calc(anchor(top))`,
			});
		}
		const nodeRect = anchorRectCache?.getRect(anchorName);

		return css({
			height: `calc(${nodeRect?.height || 0}px)`,
			left:
				position === 'left'
					? `${(nodeRect?.left || 0) - GAP + offsets.left}px`
					: `${(nodeRect?.right || 0) + GAP - offsets.right}px`,
			top: `${nodeRect?.top || 0}px`,
		});
	}, [anchorName, anchorRectCache, offsets.left, offsets.right, position]);

	const onDrop = useCallback(() => {
		const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
		if (!activeNode) {
			return;
		}

		const toPos = getPos();
		if (activeNode && toPos !== undefined) {
			const { pos: start } = activeNode;
			api?.core?.actions.execute(
				api?.blockControls?.commands?.moveToLayout(start, toPos, position),
			);
		}
	}, [api, getPos, position]);

	return (
		<Fragment>
			<div
				data-test-id={`block-ctrl-drop-target-${position}`}
				css={[dropTargetCommonStyle, dropTargetRectStyle]}
			>
				{(isDraggedOver || isBlocksDragTargetDebug()) && <DropIndicator edge={position} />}
			</div>

			<InlineHoverZone
				position={position}
				node={nextNode}
				editorWidthState={widthState}
				anchorRectCache={anchorRectCache}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={onDrop}
				offsets={offsets}
			/>
		</Fragment>
	);
};

type InlineHoverZoneProps = {
	node?: PMNode;
	editorWidthState?: EditorContainerWidth;
	anchorRectCache?: AnchorRectCache;
	position: 'left' | 'right';
	offsets: DropTargetOffsets;
	onDragEnter: () => void;
	onDragLeave: () => void;
	onDrop: () => void;
};

export const InlineHoverZone = ({
	node,
	editorWidthState,
	anchorRectCache,
	position,
	offsets,
	onDragEnter,
	onDragLeave,
	onDrop,
}: InlineHoverZoneProps) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { width: editorWith } = editorWidthState || {};
	const anchorName = node ? getNodeAnchor(node) : '';

	useEffect(() => {
		if (ref.current) {
			return dropTargetForElements({
				element: ref.current,
				onDragEnter,
				onDragLeave,
				onDrop,
			});
		}
	}, [onDragEnter, onDragLeave, onDrop]);

	const inlineHoverZoneRectStyle = useMemo(() => {
		const offset = offsets[position];

		if (isAnchorSupported()) {
			return css({
				positionAnchor: anchorName,
				left: position === 'left' ? 'unset' : `calc(anchor(right) + ${GAP - offset}px)`,
				right: position === 'left' ? `calc(anchor(left) + ${GAP - offset}px)` : 'unset',
				top: `calc(anchor(top))`,
				width: editorWith
					? `calc((${editorWith}px - anchor-size(${anchorName} width))/2 - ${HOVER_ZONE_WIDTH_OFFSET}px + ${offset}px)`
					: `${HOVER_ZONE_DEFAULT_WIDTH}px`,
				height: `calc(anchor-size(${anchorName} height))`,
			});
		}

		const nodeRect = anchorRectCache?.getRect(anchorName);
		const width = editorWith
			? (editorWith - (nodeRect?.width || 0)) / 2 - HOVER_ZONE_WIDTH_OFFSET + offset
			: HOVER_ZONE_DEFAULT_WIDTH;

		return css({
			left:
				position === 'left'
					? `${(nodeRect?.left || 0) - width - GAP + offset}px`
					: `${(nodeRect?.right || 0) + GAP - offset}px`,
			top: `${nodeRect?.top || 0}px`,
			width: `${width}px`,
			height: `calc(${anchorRectCache?.getHeight(anchorName) || 0}px - ${HOVER_ZONE_HEIGHT_OFFSET}px)`,
		});
	}, [anchorName, anchorRectCache, editorWith, offsets, position]);

	return (
		<div
			ref={ref}
			data-test-id={`drop-target-hover-zone-${position}`}
			css={[hoverZoneCommonStyle, inlineHoverZoneRectStyle]}
		/>
	);
};
