/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { layers } from '@atlaskit/theme/constants';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { getNodeAnchor } from '../pm-plugins/decorations';
import { type AnchorHeightsCache, isAnchorSupported } from '../utils/anchor-utils';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';

import { getNestedNodeLeftPaddingMargin } from './consts';
import { type DropTargetProps } from './drop-target';

const DEFAULT_DROP_INDICATOR_WIDTH = 760;
const EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_WIDTH = '--editor-block-controls-drop-indicator-width';
const EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN =
	'--editor-block-controls-drop-target-leftMargin';
const EDITOR_BLOCK_CONTROLS_DROP_TARGET_ZINDEX = '--editor-block-controls-drop-target-zindex';
export const EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET =
	'--editor-block-controls-drop-indicator-offset';
export const EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP =
	'--editor-block-controls-drop-indicator-gap';

const styleDropTarget = css({
	marginLeft: `calc(-1 * var(${EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN}, 0))`,
	paddingLeft: `var(${EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN}, 0)`,
	position: 'absolute',
	left: '0',
	display: 'block',
	zIndex: `var(${EDITOR_BLOCK_CONTROLS_DROP_TARGET_ZINDEX}, 110)`,
	transform: `translateY(var(${EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET}, 0))`,
});

const styleDropIndicator = css({
	height: '100%',
	margin: '0 auto',
	position: 'relative',
	width: `var(${EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_WIDTH}, 100%)`,
});

const nestedDropIndicatorStyle = css({
	position: 'relative',
});

const dropZoneStyles = css({
	margin: 0,
	position: 'absolute',
	width: '100%',
	zIndex: 110,
	minHeight: '4px',
});

const nestedDropZoneStyle = css({
	left: '4px',
	right: '4px',
	width: 'unset',
});

const enableDropZone = [
	'paragraph',
	'mediaSingle',
	'heading',
	'codeBlock',
	'decisionList',
	'bulletList',
	'orderedList',
	'taskList',
	'extension',
	'blockCard',
];

const HoverZone = ({
	onDragEnter,
	onDragLeave,
	onDrop,
	node,
	editorWidth,
	anchorHeightsCache,
	position,
	isNestedDropTarget,
}: {
	onDragEnter: () => void;
	onDragLeave: () => void;
	onDrop: () => void;
	anchorHeightsCache?: AnchorHeightsCache;
	position: 'upper' | 'lower';
	node?: PMNode;
	editorWidth?: number;
	isNestedDropTarget?: boolean;
}) => {
	const ref = useRef<HTMLDivElement | null>(null);

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

	const hoverZoneUpperStyle = useMemo(() => {
		const anchorName = node ? getNodeAnchor(node) : '';
		const heightStyleOffset = `var(--editor-block-controls-drop-indicator-gap, 0)/2`;
		const transformOffset = `var(${EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET}, 0)`;

		const heightStyle =
			anchorName && enableDropZone.includes(node?.type.name || '')
				? isAnchorSupported()
					? `calc(anchor-size(${anchorName} height)/2 + ${heightStyleOffset})`
					: `calc(${(anchorHeightsCache?.getHeight(anchorName) || 0) / 2}px + ${heightStyleOffset})`
				: '4px';

		const transform =
			position === 'upper'
				? `translateY(calc(-100% + ${transformOffset}))`
				: `translateY(${transformOffset})`;

		return css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			height: heightStyle,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			transform: transform,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			maxWidth: `${editorWidth || 0}px`,
		});
	}, [anchorHeightsCache, editorWidth, node, position]);

	return (
		<div
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={`drop-target-hover-zone-${position}`}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={[dropZoneStyles, isNestedDropTarget && nestedDropZoneStyle, hoverZoneUpperStyle]}
		/>
	);
};

export const DropTargetV2 = ({
	api,
	getPos,
	prevNode,
	nextNode,
	parentNode,
	formatMessage,
	anchorHeightsCache,
}: DropTargetProps & { anchorHeightsCache?: AnchorHeightsCache }) => {
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const { widthState } = useSharedPluginState(api, ['width']);

	const isNestedDropTarget = parentNode?.type.name !== 'doc';

	const onDrop = () => {
		const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
		if (!activeNode) {
			return;
		}

		const pos = getPos();
		if (activeNode && pos !== undefined) {
			const { pos: start } = activeNode;
			api?.core?.actions.execute(
				api?.blockControls?.commands?.moveNode(start, pos, undefined, formatMessage),
			);
		}
	};

	const dynamicStyle = {
		width: isNestedDropTarget ? 'unset' : '100%',
		[EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_WIDTH]: isNestedDropTarget
			? '100%'
			: `${widthState?.lineLength || DEFAULT_DROP_INDICATOR_WIDTH}px`,
		[EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN]: isNestedDropTarget
			? getNestedNodeLeftPaddingMargin(parentNode?.type.name)
			: '0',
		[EDITOR_BLOCK_CONTROLS_DROP_TARGET_ZINDEX]: editorExperiment('nested-dnd', true)
			? layers.navigation()
			: layers.card(),
	} as CSSProperties;

	return (
		<Fragment>
			<HoverZone
				onDragEnter={() => setIsDraggedOver(true)}
				onDragLeave={() => setIsDraggedOver(false)}
				onDrop={onDrop}
				node={prevNode}
				editorWidth={widthState?.lineLength}
				anchorHeightsCache={anchorHeightsCache}
				position="upper"
				isNestedDropTarget={isNestedDropTarget}
			/>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				css={[styleDropTarget, isNestedDropTarget && nestedDropIndicatorStyle]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={dynamicStyle}
				data-testid="block-ctrl-drop-target"
			>
				{
					// 4px gap to clear expand node border
					(isDraggedOver || isBlocksDragTargetDebug()) && (
						<div css={styleDropIndicator} data-testid="block-ctrl-drop-indicator">
							<DropIndicator edge="bottom" />
						</div>
					)
				}
			</div>
			<HoverZone
				onDragEnter={() => setIsDraggedOver(true)}
				onDragLeave={() => setIsDraggedOver(false)}
				onDrop={onDrop}
				node={nextNode}
				editorWidth={widthState?.lineLength}
				anchorHeightsCache={anchorHeightsCache}
				position="lower"
				isNestedDropTarget={isNestedDropTarget}
			/>
		</Fragment>
	);
};
