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

import { type DropTargetProps } from './drop-target';

const dropTargetCommonStyle = css({
	position: 'absolute',
	display: 'block',
});

const hideDropTargetStyle = css({
	display: 'none',
});

const hoverZoneCommonStyle = css({
	position: 'absolute',
	// same value as block hover zone
	zIndex: 110,
});

// gap between node boundary and drop indicator/drop zone
const GAP = 4;
const HOVER_ZONE_WIDTH_OFFSET = 40;
const HOVER_ZONE_HEIGHT_OFFSET = 10;
const HOVER_ZONE_DEFAULT_WIDTH = 40;

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

	const dropTargetRectStyle = useMemo(() => {
		if (isAnchorSupported()) {
			return css({
				height: `calc(anchor-size(${anchorName} height))`,
				positionAnchor: anchorName,
				left:
					position === 'left' ? `calc(anchor(left) - ${GAP}px)` : `calc(anchor(right) + ${GAP}px)`,
				top: `calc(anchor(top))`,
			});
		}
		const nodeRect = anchorRectCache?.getRect(anchorName);
		return css({
			height: `calc(${nodeRect?.height || 0}px)`,
			left:
				position === 'left'
					? `${(nodeRect?.left || 0) - GAP}px`
					: `${(nodeRect?.right || 0) + GAP}px`,
			top: `${nodeRect?.top || 0}px`,
		});
	}, [anchorName, anchorRectCache, position]);

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
				css={[dropTargetCommonStyle, dropTargetRectStyle, !isDraggedOver && hideDropTargetStyle]}
			>
				<DropIndicator edge={position} />
			</div>

			<InlineHoverZone
				position={position}
				node={nextNode}
				editorWidthState={widthState}
				anchorRectCache={anchorRectCache}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={onDrop}
			/>
		</Fragment>
	);
};

type InlineHoverZoneProps = {
	node?: PMNode;
	editorWidthState?: EditorContainerWidth;
	anchorRectCache?: AnchorRectCache;
	position: 'left' | 'right';
	onDragEnter: () => void;
	onDragLeave: () => void;
	onDrop: () => void;
};

export const InlineHoverZone = ({
	node,
	editorWidthState,
	anchorRectCache,
	position,
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
		if (isAnchorSupported()) {
			return css({
				positionAnchor: anchorName,
				left: position === 'left' ? 'unset' : `calc(anchor(right) + ${GAP}px)`,
				right: position === 'left' ? `calc(anchor(left) + ${GAP}px)` : 'unset',
				top: `calc(anchor(top))`,
				width: editorWith
					? `calc((${editorWith}px - anchor-size(${anchorName} width))/2 - ${HOVER_ZONE_WIDTH_OFFSET}px)`
					: `${HOVER_ZONE_DEFAULT_WIDTH}px`,
				height: `calc(anchor-size(${anchorName} height))`,
			});
		}

		const nodeRect = anchorRectCache?.getRect(anchorName);
		const width = editorWith
			? (editorWith - (nodeRect?.width || 0)) / 2 - HOVER_ZONE_WIDTH_OFFSET
			: HOVER_ZONE_DEFAULT_WIDTH;

		return css({
			left:
				position === 'left'
					? `${(nodeRect?.left || 0) - width - GAP}px`
					: `${(nodeRect?.right || 0) + GAP}px`,
			top: `${nodeRect?.top || 0}px`,
			width: `${width}px`,
			height: `calc(${anchorRectCache?.getHeight(anchorName) || 0}px - ${HOVER_ZONE_HEIGHT_OFFSET}px)`,
		});
	}, [anchorName, anchorRectCache, editorWith, position]);

	return <div ref={ref} css={[hoverZoneCommonStyle, inlineHoverZoneRectStyle]} />;
};
