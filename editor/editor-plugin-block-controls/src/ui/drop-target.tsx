/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type IntlShape } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { layers } from '@atlaskit/theme/constants';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getNodeAnchor } from '../pm-plugins/decorations-common';
import { useActiveAnchorTracker } from '../pm-plugins/utils/active-anchor-tracker';
import { type AnchorRectCache, isAnchorSupported } from '../pm-plugins/utils/anchor-utils';
import { shouldAllowInlineDropTarget } from '../pm-plugins/utils/inline-drop-target';

import { getNestedNodeLeftPaddingMargin } from './consts';
import { InlineDropTarget } from './inline-drop-target';

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
	display: 'none',
});

const styleDropIndicatorVisible = css({
	display: 'block',
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

// This z index is used in container like layout
const fullHeightStyleAdjustZIndexStyle = css({
	zIndex: 0,
});

export type DropTargetStyle = 'default' | 'remainingHeight';

export type DropTargetProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	dropTargetStyle?: DropTargetStyle;
	formatMessage?: IntlShape['formatMessage'];
	getPos: () => number | undefined;
	nextNode?: PMNode;
	parentNode?: PMNode;
	prevNode?: PMNode;
};

const HoverZone = ({
	onDragEnter,
	onDragLeave,
	onDrop,
	node,
	pos,
	parent,
	editorWidth,
	anchorRectCache,
	position,
	isNestedDropTarget,
	dropTargetStyle,
	api,
}: {
	anchorRectCache?: AnchorRectCache;
	api?: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	dropTargetStyle?: DropTargetStyle;
	editorWidth?: number;
	isNestedDropTarget?: boolean;
	node?: PMNode;
	onDragEnter: () => void;
	onDragLeave: () => void;
	onDrop: () => void;
	parent?: PMNode;
	pos?: number;
	position: 'upper' | 'lower';
}) => {
	const ref = useRef<HTMLDivElement | null>(null);

	const isRemainingheight = dropTargetStyle === 'remainingHeight';

	const anchorName = useMemo(() => {
		if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
			if (node && typeof pos === 'number') {
				const posOffset = position === 'upper' ? -node.nodeSize : 0;

				return api?.core.actions.getAnchorIdForNode(node, pos + posOffset) || '';
			}
			return '';
		}

		return node ? getNodeAnchor(node) : '';
	}, [api, node, pos, position]);
	const [_isActive, setActiveAnchor] = useActiveAnchorTracker(anchorName);

	useEffect(() => {
		if (ref.current) {
			return dropTargetForElements({
				element: ref.current,
				onDragEnter: () => {
					if (!isNestedDropTarget && editorExperiment('advanced_layouts', true)) {
						setActiveAnchor();
					}
					onDragEnter();
				},
				onDragLeave,
				onDrop,
			});
		}
	}, [isNestedDropTarget, onDragEnter, onDragLeave, onDrop, setActiveAnchor]);

	const hoverZoneUpperStyle = useMemo(() => {
		const heightStyleOffset = `var(--editor-block-controls-drop-indicator-gap, 0)/2`;
		const transformOffset = `var(${EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET}, 0)`;

		const heightStyle =
			anchorName && enableDropZone.includes(node?.type.name || '')
				? isAnchorSupported()
					? `calc(anchor-size(${anchorName} height)/2 + ${heightStyleOffset})`
					: `calc(${(anchorRectCache?.getHeight(anchorName) || 0) / 2}px + ${heightStyleOffset})`
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
	}, [anchorName, anchorRectCache, editorWidth, node?.type.name, position]);

	/**
	 * 1. Above the last empty line
	 * 2. Below the last element
	 *
	 * Both cases will take the remaining height of the the container
	 */
	const heightStyle = useMemo(() => {
		// only apply upper drop zone
		if (isRemainingheight && position === 'upper') {
			// previous node
			const anchorName = node
				? expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)
					? api?.core.actions.getAnchorIdForNode(node, pos || -1) || ''
					: getNodeAnchor(node)
				: '';

			let top = 'unset';
			if (anchorName) {
				const enabledDropZone = enableDropZone.includes(node?.type.name || '');
				if (isAnchorSupported()) {
					top = enabledDropZone
						? `calc(anchor(${anchorName} 50%))`
						: `calc(anchor(${anchorName} bottom) - 4px)`;
				} else if (anchorRectCache) {
					const preNodeTopPos = anchorRectCache.getTop(anchorName) || 0;
					const prevNodeHeight = anchorRectCache.getHeight(anchorName) || 0;

					top = enabledDropZone
						? `calc(${preNodeTopPos}px + ${prevNodeHeight / 2}px)`
						: `calc(${preNodeTopPos}px + ${prevNodeHeight}px - 4px)`;
				} else {
					// Should not happen
					return null;
				}
			} else {
				// first empty paragraph
				top = '4px';
			}

			return css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				top: top,
				bottom: '4px',
				height: 'unset',
				zIndex: 10,
				transform: 'none',
			});
		}
		return null;
	}, [anchorRectCache, api, isRemainingheight, node, pos, position]);

	const isFullHeightInLayout = isRemainingheight && parent?.type.name === 'layoutColumn';

	return (
		<div
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={`drop-target-hover-zone-${position}`}
			data-testid={`drop-target-zone-${position}`}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={[
				dropZoneStyles,
				isNestedDropTarget && nestedDropZoneStyle,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				hoverZoneUpperStyle,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				heightStyle,
				isFullHeightInLayout && fullHeightStyleAdjustZIndexStyle,
			]}
		/>
	);
};

export const DropTarget = (
	props: DropTargetProps & { anchorRectCache?: AnchorRectCache; isSameLayout?: boolean },
) => {
	const {
		api,
		getPos,
		prevNode,
		nextNode,
		parentNode,
		formatMessage,
		anchorRectCache,
		dropTargetStyle = 'default',
		isSameLayout,
	} = props;

	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const { lineLength } = useSharedPluginStateWithSelector(api, ['width'], (states) => ({
		lineLength: states.widthState?.lineLength || DEFAULT_DROP_INDICATOR_WIDTH,
	}));

	const isNestedDropTarget = parentNode?.type.name !== 'doc';

	const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
	const onDrop = () => {
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
			: `${lineLength || DEFAULT_DROP_INDICATOR_WIDTH}px`,
		[EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN]: isNestedDropTarget
			? getNestedNodeLeftPaddingMargin(parentNode?.type.name)
			: '0',
		[EDITOR_BLOCK_CONTROLS_DROP_TARGET_ZINDEX]: layers.navigation(),
	} as CSSProperties;

	return (
		<Fragment>
			<HoverZone
				onDragEnter={() => setIsDraggedOver(true)}
				onDragLeave={() => setIsDraggedOver(false)}
				onDrop={onDrop}
				node={prevNode}
				pos={getPos()}
				editorWidth={lineLength}
				anchorRectCache={anchorRectCache}
				position="upper"
				isNestedDropTarget={isNestedDropTarget}
				dropTargetStyle={dropTargetStyle}
				api={api}
			/>
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				css={[styleDropTarget, isNestedDropTarget && nestedDropIndicatorStyle]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={dynamicStyle}
				data-testid="block-ctrl-drop-target"
			>
				<div
					css={[styleDropIndicator, isDraggedOver && styleDropIndicatorVisible]}
					data-testid="block-ctrl-drop-indicator"
				>
					<DropIndicator edge="bottom" />
				</div>
			</div>
			{dropTargetStyle !== 'remainingHeight' && (
				<HoverZone
					onDragEnter={() => setIsDraggedOver(true)}
					onDragLeave={() => setIsDraggedOver(false)}
					onDrop={onDrop}
					node={nextNode}
					pos={getPos()}
					parent={parentNode}
					editorWidth={lineLength}
					anchorRectCache={anchorRectCache}
					position="lower"
					isNestedDropTarget={isNestedDropTarget}
					api={api}
				/>
			)}

			{shouldAllowInlineDropTarget(isNestedDropTarget, nextNode, isSameLayout, activeNode) && (
				<Fragment>
					<InlineDropTarget
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...props}
						position="left"
					/>
					<InlineDropTarget
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...props}
						position="right"
					/>
				</Fragment>
			)}
		</Fragment>
	);
};
