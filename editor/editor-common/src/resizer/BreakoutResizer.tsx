import React, { useCallback, useMemo, useRef, useState, useLayoutEffect } from 'react';

import { bind, bindAll, type UnbindFn } from 'bind-event-listener';

import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type { EditorAnalyticsAPI } from '../analytics';
import { type BreakoutEventPayload } from '../analytics/types/breakout-events';
import { LAYOUT_COLUMN_PADDING, LAYOUT_SECTION_MARGIN } from '../styles';
import { type EditorContainerWidth, type getPosHandlerNode } from '../types';
import { browser } from '../utils/browser';

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
	const layoutMarginOffset = fg('platform_editor_advanced_layouts_post_fix_patch_2') ? 12 : 8;

	switch (node) {
		case 'codeBlock':
			return { left: { left: '-12px' }, right: { right: '-12px' } };
		// expand and layout section elements have a negative margin applied
		default:
			const handleOffset = editorExperiment('nested-dnd', true)
				? LAYOUT_SECTION_MARGIN * 2 + layoutMarginOffset
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
	if (fg('platform_editor_breakoutresizer_remove_assertion')) {
		if (mutation.target instanceof Element) {
			return (
				mutation.target.classList.contains('resizer-item') ||
				(mutation.type === 'attributes' && mutation.attributeName === 'style')
			);
		}

		return mutation.type === 'attributes' && mutation.attributeName === 'style';
	} else {
		return (
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			(mutation.target as HTMLElement).classList.contains('resizer-item') ||
			(mutation.type === 'attributes' && mutation.attributeName === 'style')
		);
	}
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

type ResizerNextHandler = React.ElementRef<typeof Resizer>;

const RESIZE_STEP_VALUE = 10;

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
	displayGapCursor,
}: {
	editorView: EditorView;
	nodeType: BreakoutSupportedNodes;
	getPos: getPosHandlerNode;
	getRef?: (ref: HTMLElement | null) => void;
	disabled?: boolean;
	getEditorWidth: () => EditorContainerWidth | undefined;
	parentRef?: HTMLElement;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	displayGapCursor: (toggle: boolean) => boolean;
}) => {
	const [{ minWidth, maxWidth, isResizing }, setResizingState] = useState<ResizingState>({
		minWidth: undefined,
		maxWidth: undefined,
		isResizing: false,
	});
	const areResizeMetaKeysPressed = useRef(false);
	const resizerRef = useRef<ResizerNextHandler>(null);

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
		displayGapCursor(false);
		if (
			widthState !== undefined &&
			widthState.lineLength !== undefined &&
			widthState.width !== undefined
		) {
			newMaxWidth = Math.min(
				widthState.width - akEditorGutterPaddingDynamic() * 2 - akEditorGutterPadding,
				akEditorFullWidthLayoutWidth,
			);

			if (fg('platform_editor_advanced_layouts_post_fix_patch_2')) {
				newMinWidth = Math.min(widthState.lineLength, akEditorDefaultLayoutWidth, newMaxWidth);
			} else {
				newMinWidth = Math.min(widthState.lineLength, akEditorDefaultLayoutWidth);
			}
		}
		setResizingState({ isResizing: true, minWidth: newMinWidth, maxWidth: newMaxWidth });
		dispatch(state.tr.setMeta('is-resizer-resizing', true));
	}, [getEditorWidth, editorView, displayGapCursor]);

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
			displayGapCursor(true);
			dispatch(newTr);
			setResizingState({ isResizing: false, minWidth: undefined, maxWidth: undefined });
		},
		[getPos, editorView, displayGapCursor, editorAnalyticsApi],
	);
	const handleEscape = useCallback((): void => {
		editorView?.focus();
	}, [editorView]);

	const handleLayoutSizeChangeOnKeypress = useCallback(
		(step: number) => {
			if (!parentRef) {
				return;
			}

			const resizerItem = parentRef.closest('.resizer-item');
			if (!(resizerItem instanceof HTMLElement)) {
				return;
			}

			const newWidth = resizerItem.offsetWidth + step;
			if ((maxWidth && newWidth > maxWidth) || (minWidth && newWidth < minWidth)) {
				return;
			}

			handleResizeStop(
				{ width: resizerItem.offsetWidth, x: 0, y: 0, height: 0 },
				{ width: step, height: 0 },
			);
		},
		[handleResizeStop, maxWidth, minWidth, parentRef],
	);

	const resizeHandleKeyDownHandler = useCallback(
		(event: KeyboardEvent): void => {
			const isBracketKey = event.code === 'BracketRight' || event.code === 'BracketLeft';

			const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

			if (event.altKey || metaKey || event.shiftKey) {
				areResizeMetaKeysPressed.current = true;
			}

			if (event.altKey && metaKey) {
				if (isBracketKey) {
					event.preventDefault();
					handleLayoutSizeChangeOnKeypress(
						event.code === 'BracketRight' ? RESIZE_STEP_VALUE : -RESIZE_STEP_VALUE,
					);
				}
			} else if (!areResizeMetaKeysPressed.current) {
				handleEscape();
			}
		},
		[handleEscape, handleLayoutSizeChangeOnKeypress],
	);

	const resizeHandleKeyUpHandler = useCallback(
		(event: KeyboardEvent): void => {
			if (event.altKey || event.metaKey) {
				areResizeMetaKeysPressed.current = false;
			}
			return;
		},
		[areResizeMetaKeysPressed],
	);

	const resizerGlobalKeyDownHandler = useCallback(
		(event: KeyboardEvent): void => {
			if (!resizerRef.current) {
				return;
			}
			const resizeHandleThumbEl = resizerRef.current.getResizerThumbEl();
			const metaKey = browser.mac ? event.metaKey : event.ctrlKey;
			const isTargetResizeHandle =
				event.target instanceof HTMLElement &&
				event.target.classList.contains('resizer-handle-thumb');

			if (
				(event.altKey && event.shiftKey && metaKey && event.code === 'KeyR') ||
				(isTargetResizeHandle && (event.altKey || metaKey || event.shiftKey))
			) {
				event.preventDefault();

				if (!resizeHandleThumbEl) {
					return;
				}

				resizeHandleThumbEl.focus();
				resizeHandleThumbEl.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'nearest',
				});
			}
		},
		[resizerRef],
	);

	useLayoutEffect(() => {
		if (!resizerRef.current || !editorView) {
			return;
		}
		const resizeHandleThumbEl = resizerRef.current.getResizerThumbEl();
		if (!resizeHandleThumbEl) {
			return;
		}

		if (fg('platform_editor_advanced_layouts_a11y')) {
			const editorViewDom = editorView.dom;
			const unbindEditorViewDom: UnbindFn = bind(editorViewDom, {
				type: 'keydown',
				listener: resizerGlobalKeyDownHandler,
			});
			const unbindResizeHandle: UnbindFn = bindAll(resizeHandleThumbEl, [
				{ type: 'keydown', listener: resizeHandleKeyDownHandler },
				{ type: 'keyup', listener: resizeHandleKeyUpHandler },
			]);

			return () => {
				unbindEditorViewDom();
				unbindResizeHandle();
			};
		}
	}, [
		editorView,
		resizerGlobalKeyDownHandler,
		resizeHandleKeyDownHandler,
		resizeHandleKeyUpHandler,
	]);

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
			ref={resizerRef}
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
