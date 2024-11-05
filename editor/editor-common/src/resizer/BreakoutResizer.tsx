import React, { useCallback, useState } from 'react';

import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { LAYOUT_COLUMN_PADDING } from '../styles';
import { type EditorContainerWidth, type getPosHandlerNode } from '../types';

import Resizer from './Resizer';
import { type HandleResize, type HandleResizeStart } from './types';

type ResizingState = {
	isResizing: boolean;
	minWidth?: number;
	maxWidth?: number;
};

const breakoutSupportedNodes = ['layoutSection', 'expand', 'codeBlock'];

type BreakoutSupportedNodes = 'layoutSection' | 'expand' | 'codeBlock';

const getHandleStyle = (node: BreakoutSupportedNodes) => {
	switch (node) {
		case 'codeBlock':
			return { left: { left: '-12px' }, right: { right: '-12px' } };
		// expand and layout section elements have a negative margin applied
		default:
			const handleOffset = editorExperiment('nested-dnd', true)
				? LAYOUT_COLUMN_PADDING * 2 + 8
				: LAYOUT_COLUMN_PADDING * 2;
			return { left: { left: `-${handleOffset}px` }, right: { right: `-${handleOffset}px` } };
	}
};

export const ignoreResizerMutations = (
	mutation: MutationRecord | { type: 'selection'; target: Element },
) => {
	return (
		(mutation.target as HTMLElement).classList.contains('resizer-item') ||
		(mutation.type === 'attributes' && mutation.attributeName === 'style')
	);
};

/**
 * BreakoutResizer is a common component used to resize nodes that support the 'Breakout' mark, so it requires
 * correct ADF support.
 *
 * use platform_editor_advanced_layouts_breakout_resizing
 */
const BreakoutResizer = ({
	editorView,
	node,
	getPos,
	getRef,
	disabled,
	getEditorWidth,
}: {
	editorView: EditorView;
	node: BreakoutSupportedNodes;
	getPos: getPosHandlerNode;
	getRef?: (ref: HTMLElement | null) => void;
	disabled: boolean;
	getEditorWidth: () => EditorContainerWidth | undefined;
}) => {
	const [{ minWidth, maxWidth, isResizing }, setResizingState] = useState<ResizingState>({
		minWidth: undefined,
		maxWidth: undefined,
		isResizing: false,
	});

	const handleResizeStart = useCallback<HandleResizeStart>(() => {
		let newMinWidth;
		let newMaxWidth;
		const widthState = getEditorWidth();
		const { dispatch, state } = editorView;
		if (
			widthState !== undefined &&
			widthState.lineLength !== undefined &&
			widthState.width !== undefined
		) {
			newMinWidth = Math.min(widthState.lineLength, akEditorDefaultLayoutWidth);
			newMaxWidth = Math.min(
				widthState.width - akEditorGutterPaddingDynamic() * 2 - akEditorGutterPadding,
				akEditorFullWidthLayoutWidth,
			);
		}
		setResizingState({ isResizing: true, minWidth: newMinWidth, maxWidth: newMaxWidth });
		dispatch(state.tr.setMeta('is-resizer-resizing', true));
	}, [getEditorWidth, editorView]);

	const handleResizeStop = useCallback<HandleResize>(
		(originalState, delta) => {
			const newWidth = originalState.width + delta.width;
			const pos = getPos();
			if (pos === undefined) {
				return;
			}
			const { state, dispatch } = editorView;
			const { breakout } = state.schema.marks;
			const node = state.doc.nodeAt(pos);
			const newTr = state.tr;

			if (node && breakoutSupportedNodes.includes(node.type.name)) {
				newTr.setNodeMarkup(pos, node.type, node.attrs, [
					breakout.create({ width: Math.max(newWidth, akEditorDefaultLayoutWidth) }),
				]);
			}
			newTr.setMeta('is-resizer-resizing', false);
			dispatch(newTr);
			setResizingState({ isResizing: false, minWidth: undefined, maxWidth: undefined });
		},
		[editorView, getPos],
	);

	if (disabled) {
		return (
			<div
				data-testid="breakout-resizer-editor-view-wrapper"
				ref={(ref) => getRef && getRef(ref)}
			/>
		);
	}

	return (
		<Resizer
			enable={{
				left: true,
				right: true,
			}}
			handleStyles={getHandleStyle(node)}
			minWidth={minWidth}
			maxWidth={maxWidth}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={
				isResizing
					? {
							// during resize need to center as the resizer-item gets an explicit width value
							left: '50%',
							transform: 'translateX(-50%)',
						}
					: undefined
			}
			resizeRatio={2}
			handleResizeStart={handleResizeStart}
			handleResizeStop={handleResizeStop}
			handleSize="small"
			childrenDOMRef={getRef}
		/>
	);
};

export { BreakoutResizer };
