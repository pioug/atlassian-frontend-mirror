import React, { useCallback, useMemo, useState } from 'react';

import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type { EditorAnalyticsAPI } from '../analytics';
import { type BreakoutEventPayload } from '../analytics/types/breakout-events';
import { LAYOUT_COLUMN_PADDING, LAYOUT_SECTION_MARGIN } from '../styles';
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
				? LAYOUT_SECTION_MARGIN * 2 + 8
				: LAYOUT_COLUMN_PADDING * 2;
			return {
				left: {
					left: `-${handleOffset}px`,
					height: 'calc(100% - 8px)',
					bottom: '0px',
					top: 'unset',
				},
				right: {
					right: `-${handleOffset}px`,
					height: 'calc(100% - 8px)',
					bottom: '0px',
					top: 'unset',
				},
			};
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

const resizingStyles = {
	left: '50%',
	transform: 'translateX(-50%)',
	display: 'grid',
};

// Apply grid to stop drag handles rendering inside .resizer-item affecting its height
const defaultStyles = {
	display: 'grid',
};

/**
 * BreakoutResizer is a common component used to resize nodes that support the 'Breakout' mark, so it requires
 * correct ADF support.
 *
 * use experiment platform_editor_advanced_layouts
 */
const BreakoutResizer = ({
	editorView,
	nodeType,
	getPos,
	getRef,
	disabled,
	getEditorWidth,
	parentRef,
	editorAnalyticsApi,
}: {
	editorView: EditorView;
	nodeType: BreakoutSupportedNodes;
	getPos: getPosHandlerNode;
	getRef?: (ref: HTMLElement | null) => void;
	disabled?: boolean;
	getEditorWidth: () => EditorContainerWidth | undefined;
	parentRef?: HTMLElement;
	editorAnalyticsApi?: EditorAnalyticsAPI;
}) => {
	const [{ minWidth, maxWidth, isResizing }, setResizingState] = useState<ResizingState>({
		minWidth: undefined,
		maxWidth: undefined,
		isResizing: false,
	});

	// Relying on re-renders caused by selection changes inside/around node
	const isSelectionInNode = useMemo(() => {
		const pos = getPos();
		if (pos === undefined) {
			return false;
		}
		const node = editorView.state.doc.nodeAt(pos);
		if (node === null) {
			return false;
		}
		const endPos = pos + node.nodeSize;
		const startPos = pos;
		const { $from, $to } = editorView.state.selection;

		return $from.pos >= startPos && endPos >= $to.pos;
	}, [editorView.state.doc, editorView.state.selection, getPos]);

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
				const newBreakoutWidth = Math.max(newWidth, akEditorDefaultLayoutWidth);
				newTr.setNodeMarkup(pos, node.type, node.attrs, [
					breakout.create({ width: newBreakoutWidth }),
				]);

				const breakoutResizePayload: BreakoutEventPayload = {
					action: ACTION.RESIZED,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						nodeType: node.type.name as BreakoutSupportedNodes,
						prevWidth: originalState.width,
						newWidth: newBreakoutWidth,
					},
				};
				editorAnalyticsApi?.attachAnalyticsEvent(breakoutResizePayload)(newTr);
			}
			newTr.setMeta('is-resizer-resizing', false).setMeta('scrollIntoView', false);

			dispatch(newTr);
			setResizingState({ isResizing: false, minWidth: undefined, maxWidth: undefined });
		},
		[editorView, getPos, editorAnalyticsApi],
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
			handleStyles={getHandleStyle(nodeType)}
			minWidth={minWidth}
			maxWidth={maxWidth}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={isResizing ? resizingStyles : defaultStyles}
			handleResizeStart={handleResizeStart}
			handleResizeStop={handleResizeStop}
			childrenDOMRef={getRef}
			resizeRatio={2}
			isHandleVisible={isSelectionInNode}
			handleSize="clamped"
			handleHighlight="full-height"
			handlePositioning="adjacent"
			handleAlignmentMethod="sticky"
		/>
	);
};

export { BreakoutResizer };
