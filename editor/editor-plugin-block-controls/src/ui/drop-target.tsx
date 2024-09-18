/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type IntlShape } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { layers } from '@atlaskit/theme/constants';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../types';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';

import { getNestedNodeLeftPaddingMargin, nodeMargins, spaceLookupMap } from './consts';

const DEFAULT_DROP_INDICATOR_WIDTH = 760;
const EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_WIDTH = '--editor-block-controls-drop-indicator-width';
const EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN =
	'--editor-block-controls-drop-target-leftMargin';
const EDITOR_BLOCK_CONTROLS_DROP_TARGET_ZINDEX = '--editor-block-controls-drop-target-zindex';

const styleDropTarget = css({
	height: token('space.100', '8px'),
	marginTop: token('space.negative.100', '-8px'),
	marginLeft: `calc(-1 * var(${EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN}, 0))`,
	paddingLeft: `var(${EDITOR_BLOCK_CONTROLS_DROP_TARGET_LEFT_MARGIN}, 0)`,
	position: 'absolute',
	left: '0',
	display: 'block',
	zIndex: `var(${EDITOR_BLOCK_CONTROLS_DROP_TARGET_ZINDEX}, 110)`,
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

const marginLookupMap = Object.fromEntries(
	Object.entries(spaceLookupMap).map(([key, value], i) => [
		key,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		css({ transform: `translateY(${value})` }),
	]),
);

const getNodeMargins = (node?: PMNode) => {
	if (!node) {
		return nodeMargins['default'];
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return nodeMargins[`heading${node.attrs.level}`] || nodeMargins['default'];
	}

	return nodeMargins[nodeTypeName] || nodeMargins['default'];
};

const getDropTargetOffsetStyle = (prevNode?: PMNode, nextNode?: PMNode) => {
	if (!prevNode || !nextNode) {
		return null;
	}

	const top = getNodeMargins(nextNode).top;
	const bottom = getNodeMargins(prevNode).bottom;

	const marginDiff = Math.round((top - bottom) / 2);

	if (marginDiff === 0) {
		return null;
	}

	const offset = Math.max(Math.min(marginDiff, 24), -24);

	return marginLookupMap[offset];
};

export type DropTargetProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
	prevNode?: PMNode;
	nextNode?: PMNode;
	parentNode?: PMNode;
	formatMessage?: IntlShape['formatMessage'];
};

export const DropTarget = ({
	api,
	getPos,
	prevNode,
	nextNode,
	parentNode,
	formatMessage,
}: DropTargetProps) => {
	const ref = useRef(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const { widthState } = useSharedPluginState(api, ['width']);

	const isNestedDropTarget = parentNode?.type.name !== 'doc';

	useEffect(() => {
		const element = ref.current;

		if (!element) {
			return;
		}

		// Place experiments here instead of just inside move-node.ts as it stops the drag marker from appearing.
		if (editorExperiment('nest-media-and-codeblock-in-quote', false)) {
			const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
			const parentNodeType = parentNode?.type.name;
			const activeNodeType = activeNode?.nodeType;

			if (
				parentNodeType === 'blockquote' &&
				(activeNodeType === 'mediaGroup' ||
					activeNodeType === 'mediaSingle' ||
					activeNodeType === 'codeBlock')
			) {
				return;
			}
		}

		if (editorExperiment('nested-expand-in-expand', false)) {
			const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
			const parentNodeType = parentNode?.type.name;
			const activeNodeType = activeNode?.nodeType;

			if (
				parentNodeType === 'expand' &&
				(activeNodeType === 'expand' || activeNodeType === 'nestedExpand')
			) {
				return;
			}
		}

		return dropTargetForElements({
			element,
			getIsSticky: () => true,
			onDragEnter: () => {
				setIsDraggedOver(true);
			},
			onDragLeave: () => {
				setIsDraggedOver(false);
			},
			onDrop: () => {
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
			},
		});
	}, [api, formatMessage, getPos, parentNode]);

	const dropTargetOffsetStyle = useMemo(() => {
		/**
		 * First child of a nested node.
		 * Disable the position adjustment temporarily
		 */
		if (parentNode === prevNode) {
			return null;
		}
		return getDropTargetOffsetStyle(prevNode, nextNode);
	}, [prevNode, nextNode, parentNode]);

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
		// Note: Firefox has trouble with using a button element as the handle for drag and drop
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={[styleDropTarget, dropTargetOffsetStyle, isNestedDropTarget && nestedDropIndicatorStyle]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={dynamicStyle}
			ref={ref}
			data-testid="block-ctrl-drop-target"
		>
			{
				// 4px gap to clear expand node border
				(isDraggedOver || isBlocksDragTargetDebug()) && (
					<div css={styleDropIndicator} data-testid="block-ctrl-drop-indicator">
						<DropIndicator edge="bottom" gap="4px" />
					</div>
				)
			}
		</div>
	);
};
