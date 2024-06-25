/** @jsx jsx */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';

import { key } from '../pm-plugins/main';
import type { BlockControlsPlugin } from '../types';
import { selectNode } from '../utils';
import { getLeftPosition, getTopPosition } from '../utils/drag-handle-positions';

import {
	DRAG_HANDLE_BORDER_RADIUS,
	DRAG_HANDLE_HEIGHT,
	DRAG_HANDLE_WIDTH,
	DRAG_HANDLE_ZINDEX,
	dragHandleGap,
} from './consts';
import { dragPreview } from './drag-preview';

const dragHandleButtonStyles = css({
	position: 'absolute',
	padding: `${token('space.025', '2px')} 0`,
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: DRAG_HANDLE_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: DRAG_HANDLE_WIDTH,
	border: 'none',
	background: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: DRAG_HANDLE_BORDER_RADIUS,
	color: token('color.icon', '#44546F'),
	cursor: 'grab',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: DRAG_HANDLE_ZINDEX,

	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', '#091E4224'),
	},
});

const selectedStyles = css({
	backgroundColor: token('color.background.selected', '#E9F2FF'),
	color: token('color.icon.selected', '#0C66E4'),
});

export const DragHandle = ({
	view,
	api,
	getPos,
	anchorName,
	nodeType,
}: {
	view: EditorView;
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
	anchorName: string;
	nodeType: string;
}) => {
	const start = getPos();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const [blockCardWidth, setBlockCardWidth] = useState(768);
	const [dragHandleSelected, setDragHandleSelected] = useState(false);
	const { featureFlagsState } = useSharedPluginState(api, ['featureFlags']);

	useEffect(() => {
		// blockCard/datasource width is rendered correctly after this decoraton does. We need to observe for changes.
		if (nodeType === 'blockCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[data-drag-handler-anchor-name="${anchorName}"]`,
			);
			const container = dom?.querySelector('.datasourceView-content-inner-wrap');

			if (container) {
				const resizeObserver = new ResizeObserver((entries) => {
					const width = entries[0].contentBoxSize[0].inlineSize;
					setBlockCardWidth(width);
				});

				resizeObserver.observe(container);
				return () => resizeObserver.unobserve(container);
			}
		}
	}, [anchorName, nodeType, view.dom]);

	const handleOnClick = useCallback(() => {
		setDragHandleSelected(!dragHandleSelected);
		api?.core?.actions.execute(({ tr }) => {
			if (start === undefined) {
				return tr;
			}

			tr = selectNode(tr, start, nodeType);
			tr.setMeta(key, { pos: start });
			return tr;
		});

		view.focus();
	}, [start, api, view, dragHandleSelected, setDragHandleSelected, nodeType]);

	// handleMouseDown required along with onClick to ensure the correct selection
	// is set immediately when the drag handle is clicked. Otherwise browser native
	// drag and drop can take over and cause unpredictable behaviour.
	const handleMouseDown = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => {
			if (start === undefined) {
				return tr;
			}

			tr = selectNode(tr, start, nodeType);
			tr.setMeta(key, { pos: start });
			return tr;
		});
		view.focus();
	}, [start, api, view, nodeType]);

	// TODO - This needs to be investigated further. Drag preview generation is not always working
	// as expected with a node selection. This workaround sets the selection to the node on mouseDown,
	// but ensures the preview is generated correctly.
	const handleMouseDownWrapperRemoved = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => {
			if (start === undefined) {
				return tr;
			}

			const node = tr.doc.nodeAt(start);
			if (!node) {
				return tr;
			}
			const $startPos = tr.doc.resolve(start + node.nodeSize);
			const selection = new TextSelection($startPos);
			tr.setSelection(selection);
			tr.setMeta(key, { pos: start });
			return tr;
		});
	}, [start, api]);

	useEffect(() => {
		const element = buttonRef.current;
		if (!element) {
			return;
		}

		return draggable({
			element,
			getInitialData: () => ({
				type: 'element',
				start,
			}),
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				setCustomNativeDragPreview({
					render: ({ container }) => {
						const dom: HTMLElement | null = view.dom.querySelector(
							`[data-drag-handler-anchor-name="${anchorName}"]`,
						);
						if (!dom) {
							return;
						}
						return dragPreview(container, dom, nodeType);
					},
					nativeSetDragImage,
				});
			},
			onDragStart() {
				if (start === undefined) {
					return;
				}
				api?.core?.actions.execute(({ tr }) => {
					api?.blockControls?.commands.setNodeDragged(start, anchorName, nodeType)({ tr });

					const resolvedMovingNode = tr.doc.resolve(start);
					const maybeNode = resolvedMovingNode.nodeAfter;
					tr.setMeta('scrollIntoView', false);
					api?.analytics?.actions.attachAnalyticsEvent({
						eventType: EVENT_TYPE.UI,
						action: ACTION.DRAGGED,
						actionSubject: ACTION_SUBJECT.ELEMENT,
						actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
						attributes: {
							nodeDepth: resolvedMovingNode.depth,
							nodeType: maybeNode?.type.name || '',
						},
					})(tr);

					return tr;
				});

				view.focus();
			},
		});
	}, [anchorName, api, nodeType, view, start]);

	const macroInteractionUpdates = featureFlagsState?.macroInteractionUpdates;
	const positionStyles = useMemo(() => {
		const supportsAnchor =
			CSS.supports('top', `anchor(${anchorName} start)`) &&
			CSS.supports('left', `anchor(${anchorName} start)`);
		const dom: HTMLElement | null = view.dom.querySelector(
			`[data-drag-handler-anchor-name="${anchorName}"]`,
		);

		const hasResizer = nodeType === 'table' || nodeType === 'mediaSingle';
		const isExtension = nodeType === 'extension' || nodeType === 'bodiedExtension';
		const isBlockCard = nodeType === 'blockCard' && !!blockCardWidth;
		const isEmbedCard = nodeType === 'embedCard';

		let innerContainer: HTMLElement | null = null;
		if (dom) {
			if (isEmbedCard) {
				innerContainer = dom.querySelector('.rich-media-item');
			} else if (hasResizer) {
				innerContainer = dom.querySelector('.resizer-item');
			} else if (isExtension) {
				innerContainer = dom.querySelector('.extension-container[data-layout]');
			} else if (isBlockCard) {
				//specific to datasource blockCard
				innerContainer = dom.querySelector('.datasourceView-content-inner-wrap');
			}
		}

		if (supportsAnchor) {
			return {
				left:
					hasResizer || isExtension || isBlockCard || isEmbedCard
						? getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')
							? `calc(calc(anchor(${anchorName} start) + ${getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates)}`
							: getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates)
						: `calc(anchor(${anchorName} start) - ${DRAG_HANDLE_WIDTH}px - ${dragHandleGap(nodeType)}px)`,
				top: anchorName.includes('table')
					? `calc(anchor(${anchorName} start) + ${DRAG_HANDLE_HEIGHT}px)`
					: `anchor(${anchorName} start)`,
			};
		}
		return {
			left: getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates),
			top: getTopPosition(dom),
		};
	}, [anchorName, nodeType, view, blockCardWidth, macroInteractionUpdates]);

	return (
		<button
			type="button"
			css={[dragHandleButtonStyles, dragHandleSelected && selectedStyles]}
			ref={buttonRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={positionStyles}
			onClick={handleOnClick}
			onMouseDown={
				getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')
					? handleMouseDownWrapperRemoved
					: handleMouseDown
			}
			data-testid="block-ctrl-drag-handle"
		>
			<DragHandlerIcon label="" size="medium" />
		</button>
	);
};
