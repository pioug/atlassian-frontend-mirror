/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, DragEvent, KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { browser } from '@atlaskit/editor-common/browser';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	dragToMoveDown,
	dragToMoveLeft,
	dragToMoveRight,
	dragToMoveUp,
	getAriaKeyshortcuts,
	TooltipContentWithMultipleShortcuts,
} from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import { tableControlsSpacing, DRAG_HANDLE_WIDTH } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorTableToolbarSize,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles/consts';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { fg } from '@atlaskit/platform-feature-flags';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { BlockControlsPlugin, HandleOptions } from '../blockControlsPluginType';
import { getNodeTypeWithLevel } from '../pm-plugins/decorations-common';
import { key } from '../pm-plugins/main';
import { getMultiSelectAnalyticsAttributes } from '../pm-plugins/utils/analytics';
import { type AnchorRectCache } from '../pm-plugins/utils/anchor-utils';
import {
	getControlBottomCSSValue,
	getControlHeightCSSValue,
	getLeftPosition,
	getNodeHeight,
	getTopPosition,
	shouldBeSticky,
	shouldMaskNodeControls,
} from '../pm-plugins/utils/drag-handle-positions';
import { isHandleCorrelatedToSelection, selectNode } from '../pm-plugins/utils/getSelection';
import {
	alignAnchorHeadInDirectionOfPos,
	expandSelectionHeadToNodeAtPos,
} from '../pm-plugins/utils/selection';

import {
	BLOCK_MENU_ENABLED,
	DRAG_HANDLE_BORDER_RADIUS,
	DRAG_HANDLE_HEIGHT,
	DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH,
	DRAG_HANDLE_ZINDEX,
	dragHandleGap,
	nodeMargins,
	spacingBetweenNodesForPreview,
	STICKY_CONTROLS_TOP_MARGIN,
	topPositionAdjustment,
} from './consts';
import type { DragPreviewContent } from './drag-preview';
import { dragPreview } from './drag-preview';
import { refreshAnchorName } from './utils/anchor-name';
import { getAnchorAttrName } from './utils/dom-attr-name';
import { VisibilityContainer } from './visibility-container';

const iconWrapperStyles = xcss({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const buttonWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			background: `linear-gradient(to bottom, ${token('elevation.surface')} 90%, transparent)`,
			marginBottom: token('space.negative.200', '-16px'),
			paddingBottom: token('space.200', '16px'),
			marginTop: token('space.negative.400', '-32px'),
			paddingTop: `calc(${token('space.400', '32px')} - 1px)`,
			marginRight: token('space.negative.150', '-12px'),
			paddingRight: token('space.150', '12px'),
			boxSizing: 'border-box',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			background: `linear-gradient(to bottom, ${token('elevation.surface')} 90%, transparent)`,
			marginBottom: token('space.negative.200', '-16px'),
			paddingBottom: token('space.200', '16px'),
			marginTop: token('space.negative.400', '-32px'),
			paddingTop: `calc(${token('space.400', '32px')} - 1px)`,
			marginRight: token('space.negative.150', '-12px'),
			paddingRight: token('space.150', '12px'),
			boxSizing: 'border-box',
		},
});

const buttonWrapperStylesPatch = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls [data-number-column="true"] tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginRight: -akEditorTableToolbarSize,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			paddingRight: akEditorTableToolbarSize,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls [data-number-column="true"] tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginRight: -akEditorTableToolbarSize,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			paddingRight: akEditorTableToolbarSize,
		},
});

// update color to match quick insert button for new editor controls
const dragHandleColor = css({
	color: token('color.icon.subtle'),
});

const dragHandleButtonStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
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
	// when platform_editor_controls is enabled, the drag handle color is overridden. Update color here when experiment is cleaned up.
	color: token('color.icon', '#44546F'),
	cursor: 'grab',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: DRAG_HANDLE_ZINDEX,
	outline: 'none',
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', '#091E4224'),
	},

	'&:focus': {
		outline: `2px solid ${token('color.border.focused', '#388BFF')}`,
	},

	'&:disabled': {
		color: token('color.icon.disabled', '#8993A4'),
		backgroundColor: 'transparent',
	},

	'&:hover:disabled': {
		backgroundColor: token('color.background.disabled', 'transparent'),
	},
});

const dragHandleButtonSmallScreenStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	[`@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`]: {
		opacity: 0,
		visibility: 'hidden',
	},
});

const dragHandleButtonStylesOld = css({
	position: 'absolute',
	paddingTop: `${token('space.025', '2px')}`,
	paddingBottom: `${token('space.025', '2px')}`,
	paddingLeft: '0',
	paddingRight: '0',
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
	// when platform_editor_controls is enabled, the drag handle color is overridden. Update color here when experiment is cleaned up.
	color: token('color.icon', '#44546F'),
	cursor: 'grab',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: DRAG_HANDLE_ZINDEX,
	outline: 'none',

	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', '#091E4224'),
	},

	'&:focus': {
		outline: `2px solid ${token('color.border.focused', '#388BFF')}`,
	},

	'&:disabled': {
		color: token('color.icon.disabled', '#8993A4'),
		backgroundColor: 'transparent',
	},

	'&:hover:disabled': {
		backgroundColor: token('color.background.disabled', 'transparent'),
	},
});

const dragHandleContainerStyles = xcss({
	position: 'absolute',
	boxSizing: 'border-box',
});

const tooltipContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	bottom: `-${STICKY_CONTROLS_TOP_MARGIN}px`,
	position: 'sticky',
	display: 'block',
	zIndex: 100, // card = 100
});

const tooltipContainerStylesStickyHeaderWithMask = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	top: `${STICKY_CONTROLS_TOP_MARGIN}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			top: '0',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			top: '0',
		},
});

const tooltipContainerStylesStickyHeaderWithoutMask = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	top: `${STICKY_CONTROLS_TOP_MARGIN}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: tableControlsSpacing,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: tableControlsSpacing,
		},
});

const dragHandleMultiLineSelectionFixFirefox = css({
	'&::selection': {
		backgroundColor: 'transparent',
	},
});

const layoutColumnDragHandleStyles = css({
	transform: 'rotate(90deg)',
});

const selectedStyles = css({
	backgroundColor: token('color.background.selected', '#E9F2FF'),
	color: token('color.icon.selected', '#0C66E4'),
});

// [Chrome only] When selection contains multiple nodes and then drag a drag handle that is within the selection range,
// icon span receives dragStart event, instead of button, and since it is not registered as a draggable element
// with pragmatic DnD and pragmatic DnD is not triggered
const handleIconDragStart = (e: DragEvent<HTMLSpanElement>) => {
	if (!browser.chrome || !fg('platform_editor_dnd_update_drag_start_target')) {
		return;
	}
	// prevent dragStart handler triggered by icon
	e.stopPropagation();

	const dragEvent = new DragEvent('dragstart', {
		bubbles: true,
		cancelable: true,
		dataTransfer: e.dataTransfer,
	});

	if (e.target instanceof HTMLElement) {
		// re-dispatch drag event on button so that pragmatic DnD can be triggered properly
		e.target.closest('button')?.dispatchEvent(dragEvent);
	}
};

const getNodeSpacingForPreview = (node?: PMNode) => {
	if (!node) {
		return spacingBetweenNodesForPreview['default'];
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return (
			spacingBetweenNodesForPreview[`heading${node.attrs.level}`] ||
			spacingBetweenNodesForPreview['default']
		);
	}

	return spacingBetweenNodesForPreview[nodeTypeName] || spacingBetweenNodesForPreview['default'];
};

const getNodeMargins = (node?: PMNode): { bottom: number; top: number } => {
	if (!node) {
		return nodeMargins['default'];
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return nodeMargins[`heading${node.attrs.level}`] || nodeMargins['default'];
	}

	return nodeMargins[nodeTypeName] || nodeMargins['default'];
};

type DragHandleProps = {
	anchorName: string;
	anchorRectCache?: AnchorRectCache;
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	formatMessage: IntlShape['formatMessage'];
	getPos: () => number | undefined;
	handleOptions?: HandleOptions;
	isTopLevelNode?: boolean;
	nodeType: string;
	view: EditorView;
};

export const DragHandle = ({
	view,
	api,
	formatMessage,
	getPos,
	anchorName,
	nodeType,
	handleOptions,
	isTopLevelNode = true,
	anchorRectCache,
}: DragHandleProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [dragHandleSelected, setDragHandleSelected] = useState(false);
	const [dragHandleDisabled, setDragHandleDisabled] = useState(false);
	const [blockCardWidth, setBlockCardWidth] = useState(768);
	const [recalculatePosition, setRecalculatePosition] = useState<boolean>(false);
	const [positionStylesOld, setPositionStylesOld] = useState<CSSProperties>({ display: 'none' });
	const { macroInteractionUpdates } = useSharedPluginStateWithSelector(
		api,
		['featureFlags'],
		(states) => ({
			macroInteractionUpdates: states.featureFlagsState?.macroInteractionUpdates,
		}),
	);
	const selection = useSharedPluginStateSelector(api, 'selection.selection');
	const isShiftDown = useSharedPluginStateSelector(api, 'blockControls.isShiftDown');
	const interactionState = useSharedPluginStateSelector(api, 'interaction.interactionState');

	const start = getPos();
	const isLayoutColumn = nodeType === 'layoutColumn';
	const isMultiSelect = editorExperiment('platform_editor_element_drag_and_drop_multiselect', true);

	useEffect(() => {
		if (editorExperiment('platform_editor_block_control_optimise_render', true)) {
			return;
		}
		// blockCard/datasource width is rendered correctly after this decoraton does. We need to observe for changes.
		if (nodeType === 'blockCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[${getAnchorAttrName()}="${anchorName}"]`,
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

	const handleOnClick = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			if (!isMultiSelect) {
				setDragHandleSelected(!dragHandleSelected);
			}
			api?.core?.actions.execute(({ tr }) => {
				const startPos = getPos();

				if (startPos === undefined) {
					return tr;
				}
				const mSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
				const $anchor =
					mSelect?.anchor !== undefined ? tr.doc.resolve(mSelect?.anchor) : tr.selection.$anchor;
				if (!isMultiSelect || tr.selection.empty || !e.shiftKey) {
					tr = selectNode(tr, startPos, nodeType);
					if (BLOCK_MENU_ENABLED && editorExperiment('platform_editor_controls', 'variant1')) {
						api?.blockControls?.commands.toggleBlockMenu({ anchorName })({ tr });
						e.stopPropagation();
					} else if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
						api?.blockControls?.commands.toggleBlockMenu({ anchorName })({ tr });
						e.stopPropagation();
					}
				} else if (
					isTopLevelNode &&
					$anchor.depth <= DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH &&
					e.shiftKey &&
					fg('platform_editor_elements_dnd_shift_click_select')
				) {
					const alignAnchorHeadToSel = alignAnchorHeadInDirectionOfPos(tr.selection, startPos);
					const selectionWithExpandedHead = expandSelectionHeadToNodeAtPos(
						alignAnchorHeadToSel,
						startPos,
					);
					tr.setSelection(selectionWithExpandedHead);
					api?.blockControls?.commands.setMultiSelectPositions()({ tr });
				}
				const resolvedMovingNode = tr.doc.resolve(startPos);
				const maybeNode = resolvedMovingNode.nodeAfter;

				tr.setMeta('scrollIntoView', false);
				api?.analytics?.actions.attachAnalyticsEvent({
					eventType: EVENT_TYPE.UI,
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
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
		[
			isMultiSelect,
			api?.core?.actions,
			api?.blockControls.sharedState,
			api?.blockControls?.commands,
			api?.analytics?.actions,
			view,
			dragHandleSelected,
			getPos,
			isTopLevelNode,
			nodeType,
			anchorName,
		],
	);

	// TODO: ED-26959 - This needs to be investigated further. Drag preview generation is not always working
	// as expected with a node selection. This workaround sets the selection to the node on mouseDown,
	// but ensures the preview is generated correctly.
	const handleMouseDown = useCallback(() => {
		if (editorExperiment('advanced_layouts', true)) {
			// prevent native drag and drop.
			buttonRef.current?.focus();

			if (!isLayoutColumn) {
				return undefined;
			}
		}
	}, [isLayoutColumn]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			if (fg('platform_editor_element_drag_and_drop_ed_23873')) {
				// allow user to use spacebar to select the node
				if (!e.repeat && e.key === ' ') {
					const startPos = getPos();
					api?.core?.actions.execute(({ tr }) => {
						if (startPos === undefined) {
							return tr;
						}

						const node = tr.doc.nodeAt(startPos);
						if (!node) {
							return tr;
						}
						const $startPos = tr.doc.resolve(startPos + node.nodeSize);
						const selection = new TextSelection($startPos);
						tr.setSelection(selection);
						!isMultiSelect && tr.setMeta(key, { pos: startPos });
						return tr;
					});
				} else if (![e.altKey, e.ctrlKey, e.shiftKey].some((pressed) => pressed)) {
					// If not trying to press shortcut keys,
					// return focus to editor to resume editing from caret position
					view.focus();
				}
			}
		},
		[getPos, api?.core?.actions, isMultiSelect, view],
	);

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
				if (isMultiSelect) {
					api?.core?.actions.execute(({ tr }) => {
						const handlePos = getPos();
						if (typeof handlePos !== 'number') {
							return tr;
						}
						const oldHandlePosCheck =
							handlePos >= tr.selection.$from.start() - 1 && handlePos <= tr.selection.to;
						const newHandlePosCheck = isHandleCorrelatedToSelection(
							view.state,
							tr.selection,
							handlePos,
						);
						if (
							!tr.selection.empty &&
							(fg('platform_editor_elements_dnd_multi_select_patch_1')
								? newHandlePosCheck
								: oldHandlePosCheck)
						) {
							api?.blockControls?.commands.setMultiSelectPositions()({ tr });
						} else if (fg('platform_editor_elements_dnd_select_node_on_drag')) {
							tr = selectNode(tr, handlePos, nodeType);
						}

						return tr;
					});
				}

				const startPos = getPos();
				const state = view.state;
				const { doc, selection } = state;
				let sliceFrom = selection.from;
				let sliceTo = selection.to;
				const mSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
				if (mSelect) {
					const { anchor, head } = mSelect;
					sliceFrom = Math.min(anchor, head);
					sliceTo = Math.max(anchor, head);
				}
				const expandedSlice = doc.slice(sliceFrom, sliceTo);

				const isDraggingMultiLine =
					isMultiSelect &&
					startPos !== undefined &&
					startPos >= sliceFrom &&
					startPos < sliceTo &&
					expandedSlice.content.childCount > 1;

				setCustomNativeDragPreview({
					getOffset: () => {
						if (!isDraggingMultiLine) {
							return { x: 0, y: 0 };
						} else {
							// Calculate the offset of the preview container,
							// So when drag multiple nodes, the preview align with the position of the selected nodes
							const domAtPos = view.domAtPos.bind(view);
							let domElementsHeightBeforeHandle = 0;
							const nodesStartPos: number[] = [];
							const nodesEndPos: number[] = [];
							let activeNodeMarginTop = 0;

							for (let i = 0; i < expandedSlice.content.childCount; i++) {
								if (i === 0) {
									nodesStartPos[i] = sliceFrom;
									nodesEndPos[i] = sliceFrom + (expandedSlice.content.maybeChild(i)?.nodeSize || 0);
								} else {
									nodesStartPos[i] = nodesEndPos[i - 1];
									nodesEndPos[i] =
										nodesStartPos[i] + (expandedSlice.content.maybeChild(i)?.nodeSize || 0);
								}

								// when the node is before the handle, calculate the height of the node
								if (nodesEndPos[i] <= startPos) {
									// eslint-disable-next-line @atlaskit/editor/no-as-casting
									const currentNodeElement = findDomRefAtPos(
										nodesStartPos[i],
										domAtPos,
									) as HTMLElement;
									const maybeCurrentNode = expandedSlice.content.maybeChild(i);
									const currentNodeSpacing = maybeCurrentNode
										? getNodeMargins(maybeCurrentNode).top + getNodeMargins(maybeCurrentNode).bottom
										: 0;
									domElementsHeightBeforeHandle =
										domElementsHeightBeforeHandle +
										currentNodeElement.offsetHeight +
										currentNodeSpacing;
								} else {
									// when the node is after the handle, calculate the top margin of the active node
									const maybeNextNode = expandedSlice.content.maybeChild(i);
									activeNodeMarginTop = maybeNextNode ? getNodeMargins(maybeNextNode).top : 0;
									break;
								}
							}

							return { x: 0, y: domElementsHeightBeforeHandle + activeNodeMarginTop };
						}
					},
					render: ({ container }) => {
						const dom: HTMLElement | null = view.dom.querySelector(
							`[${getAnchorAttrName()}="${anchorName}"]`,
						);

						if (!dom) {
							return;
						}

						if (!isDraggingMultiLine) {
							return dragPreview(container, { dom, nodeType });
						} else {
							const domAtPos = view.domAtPos.bind(view);
							const previewContent: DragPreviewContent[] = [];
							expandedSlice.content.descendants((node, pos, _parent, _index) => {
								// Get the dom element of the node
								//eslint-disable-next-line @atlaskit/editor/no-as-casting
								const nodeDomElement = findDomRefAtPos(sliceFrom + pos, domAtPos) as HTMLElement;
								const currentNodeSpacing = getNodeSpacingForPreview(node);
								previewContent.push({
									dom: nodeDomElement,
									nodeType: node.type.name,
									nodeSpacing: currentNodeSpacing,
								});

								return false; // Only iterate through the first level of nodes
							});

							return dragPreview(container, previewContent);
						}
					},
					nativeSetDragImage,
				});
			},
			onDragStart() {
				if (start === undefined) {
					return;
				}
				api?.core?.actions.execute(({ tr }) => {
					let nodeTypes, hasSelectedMultipleNodes;
					const resolvedMovingNode = tr.doc.resolve(start);
					const maybeNode = resolvedMovingNode.nodeAfter;
					const mSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
					if (mSelect) {
						const attributes = getMultiSelectAnalyticsAttributes(tr, mSelect.anchor, mSelect.head);
						nodeTypes = attributes.nodeTypes;
						hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
					} else {
						nodeTypes = maybeNode?.type.name;
						hasSelectedMultipleNodes = false;
					}

					api?.blockControls?.commands.setNodeDragged(getPos, anchorName, nodeType)({ tr });

					tr.setMeta('scrollIntoView', false);

					api?.analytics?.actions.attachAnalyticsEvent({
						eventType: EVENT_TYPE.UI,
						action: ACTION.DRAGGED,
						actionSubject: ACTION_SUBJECT.ELEMENT,
						actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
						attributes: {
							nodeDepth: resolvedMovingNode.depth,
							nodeType: maybeNode?.type.name || '',
							...(isMultiSelect && { nodeTypes, hasSelectedMultipleNodes }),
						},
					})(tr);
					return tr;
				});

				view.focus();
			},
		});
	}, [anchorName, api, getPos, isMultiSelect, nodeType, start, view]);

	const positionStyles = useMemo(() => {
		if (!editorExperiment('platform_editor_block_control_optimise_render', true)) {
			return {};
		}

		// This is a no-op to allow recalculatePosition to be used as a dependency
		if (recalculatePosition) {
			setRecalculatePosition(recalculatePosition);
		}

		const pos = getPos();
		const $pos = expValEquals('platform_editor_native_anchor_support', 'isEnabled', true)
			? typeof pos === 'number' && view.state.doc.resolve(pos)
			: pos && view.state.doc.resolve(pos);
		const parentPos = $pos && $pos.depth ? $pos.before() : undefined;
		const node = parentPos !== undefined ? view.state.doc.nodeAt(parentPos) : undefined;
		const parentNodeType = node?.type.name;
		const supportsAnchor =
			CSS.supports('top', `anchor(${anchorName} start)`) &&
			CSS.supports('left', `anchor(${anchorName} start)`);

		const safeAnchorName = editorExperiment('platform_editor_controls', 'variant1')
			? refreshAnchorName({ getPos, view, anchorName })
			: anchorName;

		const dom: HTMLElement | null = view.dom.querySelector(
			`[${getAnchorAttrName()}="${safeAnchorName}"]`,
		);

		const hasResizer = nodeType === 'table' || nodeType === 'mediaSingle';
		const isExtension =
			nodeType === 'extension' ||
			nodeType === 'bodiedExtension' ||
			(nodeType === 'multiBodiedExtension' &&
				fg('platform_editor_multi_body_extension_extensibility'));
		const isBlockCard = nodeType === 'blockCard';

		const isEmbedCard = nodeType === 'embedCard';

		const isMacroInteractionUpdates = macroInteractionUpdates && isExtension;

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

		const isEdgeCase = (hasResizer || isExtension || isEmbedCard || isBlockCard) && innerContainer;
		const isSticky = shouldBeSticky(nodeType);

		if (supportsAnchor) {
			const bottom = editorExperiment('platform_editor_controls', 'variant1')
				? getControlBottomCSSValue(safeAnchorName, isSticky, isTopLevelNode, isLayoutColumn)
				: {};

			return {
				left: isEdgeCase
					? `calc(anchor(${safeAnchorName} start) + ${getLeftPosition(dom, nodeType, innerContainer, isMacroInteractionUpdates, parentNodeType)})`
					: editorExperiment('advanced_layouts', true) && isLayoutColumn
						? `calc((anchor(${safeAnchorName} right) + anchor(${safeAnchorName} left))/2 - ${DRAG_HANDLE_HEIGHT / 2}px)`
						: `calc(anchor(${safeAnchorName} start) - ${DRAG_HANDLE_WIDTH}px - ${dragHandleGap(nodeType, parentNodeType)}px)`,

				top:
					editorExperiment('advanced_layouts', true) && isLayoutColumn
						? `calc(anchor(${safeAnchorName} top) - ${DRAG_HANDLE_WIDTH}px)`
						: `calc(anchor(${safeAnchorName} start) + ${
								expValEquals('platform_editor_native_anchor_support', 'isEnabled', true)
									? ($pos && $pos.nodeAfter && getNodeTypeWithLevel($pos.nodeAfter)) || nodeType
									: nodeType
							}px)`,

				...bottom,
			};
		}

		const height = editorExperiment('platform_editor_controls', 'variant1')
			? getControlHeightCSSValue(
					getNodeHeight(dom, safeAnchorName, anchorRectCache) || 0,
					isSticky,
					isTopLevelNode,
					`${DRAG_HANDLE_HEIGHT}`,
					isLayoutColumn,
				)
			: {};
		return {
			left: isEdgeCase
				? `calc(${dom?.offsetLeft || 0}px + ${getLeftPosition(dom, nodeType, innerContainer, isMacroInteractionUpdates, parentNodeType)})`
				: getLeftPosition(dom, nodeType, innerContainer, isMacroInteractionUpdates, parentNodeType),
			top: getTopPosition(dom, nodeType),
			...height,
		};
	}, [
		anchorName,
		getPos,
		view,
		nodeType,
		macroInteractionUpdates,
		anchorRectCache,
		isTopLevelNode,
		isLayoutColumn,
		recalculatePosition,
	]);

	const calculatePositionOld = useCallback(() => {
		const pos = getPos();
		const $pos = expValEquals('platform_editor_native_anchor_support', 'isEnabled', true)
			? typeof pos === 'number' && view.state.doc.resolve(pos)
			: pos && view.state.doc.resolve(pos);
		const parentPos = $pos && $pos.depth ? $pos.before() : undefined;
		const node = parentPos !== undefined ? view.state.doc.nodeAt(parentPos) : undefined;
		const parentNodeType = node?.type.name;
		const supportsAnchor =
			CSS.supports('top', `anchor(${anchorName} start)`) &&
			CSS.supports('left', `anchor(${anchorName} start)`);

		const safeAnchorName = editorExperiment('platform_editor_controls', 'variant1')
			? refreshAnchorName({ getPos, view, anchorName })
			: anchorName;

		const dom: HTMLElement | null = view.dom.querySelector(
			`[${getAnchorAttrName()}="${safeAnchorName}"]`,
		);

		const hasResizer = nodeType === 'table' || nodeType === 'mediaSingle';
		const isExtension =
			nodeType === 'extension' ||
			nodeType === 'bodiedExtension' ||
			(nodeType === 'multiBodiedExtension' &&
				fg('platform_editor_multi_body_extension_extensibility'));
		const isBlockCard = nodeType === 'blockCard' && !!blockCardWidth;
		const isEmbedCard = nodeType === 'embedCard';

		const isMacroInteractionUpdates = macroInteractionUpdates && isExtension;

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

		const isEdgeCase = (hasResizer || isExtension || isEmbedCard || isBlockCard) && innerContainer;
		const isSticky = shouldBeSticky(nodeType);

		if (supportsAnchor) {
			const bottom = editorExperiment('platform_editor_controls', 'variant1')
				? getControlBottomCSSValue(safeAnchorName, isSticky, isTopLevelNode, isLayoutColumn)
				: {};

			return {
				left: isEdgeCase
					? `calc(anchor(${safeAnchorName} start) + ${getLeftPosition(dom, nodeType, innerContainer, isMacroInteractionUpdates, parentNodeType)})`
					: editorExperiment('advanced_layouts', true) && isLayoutColumn
						? `calc((anchor(${safeAnchorName} right) + anchor(${safeAnchorName} left))/2 - ${DRAG_HANDLE_HEIGHT / 2}px)`
						: `calc(anchor(${safeAnchorName} start) - ${DRAG_HANDLE_WIDTH}px - ${dragHandleGap(nodeType, parentNodeType)}px)`,

				top:
					editorExperiment('advanced_layouts', true) && isLayoutColumn
						? `calc(anchor(${safeAnchorName} top) - ${DRAG_HANDLE_WIDTH}px)`
						: `calc(anchor(${safeAnchorName} start) + ${topPositionAdjustment(
								expValEquals('platform_editor_native_anchor_support', 'isEnabled', true)
									? ($pos && $pos.nodeAfter && getNodeTypeWithLevel($pos.nodeAfter)) || nodeType
									: nodeType,
							)}px)`,

				...bottom,
			};
		}

		const height = editorExperiment('platform_editor_controls', 'variant1')
			? getControlHeightCSSValue(
					getNodeHeight(dom, safeAnchorName, anchorRectCache) || 0,
					isSticky,
					isTopLevelNode,
					`${DRAG_HANDLE_HEIGHT}`,
					isLayoutColumn,
				)
			: {};
		return {
			left: isEdgeCase
				? `calc(${dom?.offsetLeft || 0}px + ${getLeftPosition(dom, nodeType, innerContainer, isMacroInteractionUpdates, parentNodeType)})`
				: getLeftPosition(dom, nodeType, innerContainer, isMacroInteractionUpdates, parentNodeType),
			top: getTopPosition(dom, nodeType),
			...height,
		};
	}, [
		anchorName,
		getPos,
		view,
		nodeType,
		blockCardWidth,
		macroInteractionUpdates,
		anchorRectCache,
		isTopLevelNode,
		isLayoutColumn,
	]);

	useEffect(() => {
		if (editorExperiment('platform_editor_block_control_optimise_render', true)) {
			return;
		}

		let cleanUpTransitionListener: () => void;

		if (nodeType === 'extension' || nodeType === 'embedCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[${getAnchorAttrName()}="${anchorName}"]`,
			);
			if (!dom) {
				return;
			}
			cleanUpTransitionListener = bind(dom, {
				type: 'transitionend',
				listener: () => {
					setPositionStylesOld(calculatePositionOld());
				},
			});
		}
		const calcPos = requestAnimationFrame(() => {
			setPositionStylesOld(calculatePositionOld());
		});

		return () => {
			cancelAnimationFrame(calcPos);
			cleanUpTransitionListener?.();
		};
	}, [calculatePositionOld, view.dom, anchorName, nodeType]);

	useEffect(() => {
		if (!editorExperiment('platform_editor_block_control_optimise_render', true)) {
			return;
		}

		let cleanUpTransitionListener: () => void;

		if (nodeType === 'extension' || nodeType === 'embedCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[${getAnchorAttrName()}="${anchorName}"]`,
			);
			if (!dom) {
				return;
			}
			cleanUpTransitionListener = bind(dom, {
				type: 'transitionend',
				listener: () => {
					setRecalculatePosition(!recalculatePosition);
				},
			});
		}

		return () => {
			cleanUpTransitionListener?.();
		};
	}, [view, anchorName, nodeType, recalculatePosition]);

	useEffect(() => {
		if (
			handleOptions?.isFocused &&
			buttonRef.current &&
			fg('platform_editor_element_drag_and_drop_ed_23873')
		) {
			const id = requestAnimationFrame(() => {
				buttonRef.current?.focus();
			});
			return () => {
				cancelAnimationFrame(id);
				if (!editorExperiment('platform_editor_block_control_optimise_render', true)) {
					view.focus();
				}
			};
		}
	}, [buttonRef, handleOptions?.isFocused, view]);

	useEffect(() => {
		if (!isMultiSelect || typeof start !== 'number' || !selection) {
			return;
		}

		setDragHandleSelected(isHandleCorrelatedToSelection(view.state, selection, start));
	}, [start, selection, view, isMultiSelect]);

	useEffect(() => {
		if (
			!isMultiSelect ||
			isShiftDown === undefined ||
			view.state.selection.empty ||
			!fg('platform_editor_elements_dnd_shift_click_select')
		) {
			return;
		}
		const mSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
		const $anchor =
			mSelect?.anchor !== undefined
				? view.state.doc.resolve(mSelect?.anchor)
				: view.state.selection.$anchor;
		if (
			isShiftDown &&
			(!isTopLevelNode || (isTopLevelNode && $anchor.depth > DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH))
		) {
			setDragHandleDisabled(true);
		} else {
			setDragHandleDisabled(false);
		}
	}, [api?.blockControls.sharedState, isMultiSelect, isShiftDown, isTopLevelNode, view]);

	let helpDescriptors = isTopLevelNode
		? [
				{
					description: formatMessage(blockControlsMessages.dragToMove),
				},
				{
					description: formatMessage(blockControlsMessages.moveUp),
					keymap: dragToMoveUp,
				},
				{
					description: formatMessage(blockControlsMessages.moveDown),
					keymap: dragToMoveDown,
				},
				{
					description: formatMessage(blockControlsMessages.moveLeft),
					keymap: dragToMoveLeft,
				},
				{
					description: formatMessage(blockControlsMessages.moveRight),
					keymap: dragToMoveRight,
				},
			]
		: [
				{
					description: formatMessage(blockControlsMessages.dragToMove),
				},
				{
					description: formatMessage(blockControlsMessages.moveUp),
					keymap: dragToMoveUp,
				},
				{
					description: formatMessage(blockControlsMessages.moveDown),
					keymap: dragToMoveDown,
				},
			];

	let isParentNodeOfTypeLayout;

	if (!isTopLevelNode) {
		const pos = getPos();
		if (typeof pos === 'number') {
			const $pos = view.state.doc.resolve(pos);
			isParentNodeOfTypeLayout = $pos?.parent?.type.name === 'layoutColumn';
		}

		if (isParentNodeOfTypeLayout) {
			helpDescriptors = [
				...helpDescriptors,
				{
					description: formatMessage(blockControlsMessages.moveLeft),
					keymap: dragToMoveLeft,
				},
				{
					description: formatMessage(blockControlsMessages.moveRight),
					keymap: dragToMoveRight,
				},
			];
		}
	}

	// When advanced layout is on, layout column drag handle show only show 'Drag to move', no shortcuts
	if (editorExperiment('advanced_layouts', true) && nodeType === 'layoutColumn') {
		helpDescriptors = [
			{
				description: formatMessage(blockControlsMessages.dragToRearrange),
			},
			{
				description: formatMessage(blockControlsMessages.moveUp),
				keymap: dragToMoveUp,
			},
			{
				description: formatMessage(blockControlsMessages.moveDown),
				keymap: dragToMoveDown,
			},
			{
				description: formatMessage(blockControlsMessages.moveLeft),
				keymap: dragToMoveLeft,
			},
			{
				description: formatMessage(blockControlsMessages.moveRight),
				keymap: dragToMoveRight,
			},
		];
	}

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		helpDescriptors = [
			{
				description: formatMessage(blockControlsMessages.dragToMove),
			},
		];
	}

	const message = helpDescriptors
		.map((descriptor) => {
			return descriptor.keymap
				? [descriptor.description, getAriaKeyshortcuts(descriptor.keymap)]
				: [descriptor.description];
		})
		.join('. ');

	const handleOnDrop = (event: MouseEvent<HTMLButtonElement>) => {
		editorExperiment('platform_editor_element_drag_and_drop_multiselect', true) &&
			event.stopPropagation();
	};

	const hasHadInteraction = interactionState !== 'hasNotHadInteraction';

	const renderButton = () => (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			css={[
				editorExperiment('platform_editor_controls', 'variant1')
					? dragHandleButtonStyles
					: dragHandleButtonStylesOld,
				editorExperiment('platform_editor_controls', 'variant1') && dragHandleColor,
				// ED-26266: Fixed the drag handle highlight when selecting multiple line in Firefox
				// See https://product-fabric.atlassian.net/browse/ED-26266
				browser.gecko && dragHandleMultiLineSelectionFixFirefox,
				editorExperiment('advanced_layouts', true) &&
					isLayoutColumn &&
					layoutColumnDragHandleStyles,
				dragHandleSelected && hasHadInteraction && selectedStyles,
				expValEqualsNoExposure('platform_editor_preview_panel_responsiveness', 'isEnabled', true) &&
					editorExperiment('platform_editor_controls', 'control') &&
					dragHandleButtonSmallScreenStyles,
			]}
			ref={buttonRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				!editorExperiment('platform_editor_controls', 'variant1')
					? editorExperiment('platform_editor_block_control_optimise_render', true)
						? positionStyles
						: positionStylesOld
					: {}
			}
			onClick={handleOnClick}
			onMouseDown={handleMouseDown}
			onKeyDown={handleKeyDown}
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
			onDrop={handleOnDrop}
			disabled={dragHandleDisabled}
			data-editor-block-ctrl-drag-handle
			data-testid="block-ctrl-drag-handle"
			aria-label={
				expValEquals('platform_editor_drag_handle_aria_label', 'isEnabled', true)
					? formatMessage(blockControlsMessages.dragToMove)
					: ''
			}
		>
			<Box
				xcss={iconWrapperStyles}
				// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
				onDragStart={handleIconDragStart}
			>
				<DragHandleVerticalIcon
					spacing="spacious"
					label=""
					LEGACY_fallbackIcon={DragHandlerIcon}
					LEGACY_size="medium"
					size="small"
				/>
			</Box>
		</button>
	);

	const stickyWithTooltip = () => (
		<Box
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={
				editorExperiment('platform_editor_block_control_optimise_render', true)
					? positionStyles
					: positionStylesOld
			}
			xcss={[dragHandleContainerStyles]}
			as="span"
			testId="block-ctrl-drag-handle-container"
		>
			<span
				css={[
					tooltipContainerStyles,
					shouldMaskNodeControls(nodeType, isTopLevelNode) &&
						tooltipContainerStylesStickyHeaderWithMask,
					!shouldMaskNodeControls(nodeType, isTopLevelNode) &&
						tooltipContainerStylesStickyHeaderWithoutMask,
				]}
			>
				<Tooltip
					content={<TooltipContentWithMultipleShortcuts helpDescriptors={helpDescriptors} />}
					ignoreTooltipPointerEvents={true}
					position={'top'}
					onShow={() => {
						api?.accessibilityUtils?.actions.ariaNotify(message, { priority: 'important' });
					}}
				>
					<span
						css={[
							shouldMaskNodeControls(nodeType, isTopLevelNode) && buttonWrapperStyles,
							fg('platform_editor_controls_patch_15') && buttonWrapperStylesPatch,
						]}
					>
						{renderButton()}
					</span>
				</Tooltip>
			</span>
		</Box>
	);

	const stickyWithoutTooltip = () => (
		<Box
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={
				editorExperiment('platform_editor_block_control_optimise_render', true)
					? positionStyles
					: positionStylesOld
			}
			xcss={[dragHandleContainerStyles]}
			as="span"
			testId="block-ctrl-drag-handle-container"
		>
			<span
				css={[
					tooltipContainerStyles,
					shouldMaskNodeControls(nodeType, isTopLevelNode) &&
						tooltipContainerStylesStickyHeaderWithMask,
					!shouldMaskNodeControls(nodeType, isTopLevelNode) &&
						tooltipContainerStylesStickyHeaderWithoutMask,
				]}
			>
				<span
					css={[
						shouldMaskNodeControls(nodeType, isTopLevelNode) && buttonWrapperStyles,
						fg('platform_editor_controls_patch_15') && buttonWrapperStylesPatch,
					]}
				>
					{renderButton()}
				</span>
			</span>
		</Box>
	);

	const buttonWithTooltip = () => (
		<Tooltip
			content={<TooltipContentWithMultipleShortcuts helpDescriptors={helpDescriptors} />}
			ignoreTooltipPointerEvents={true}
			onShow={() => {
				api?.accessibilityUtils?.actions.ariaNotify(message, { priority: 'important' });
			}}
		>
			{renderButton()}
		</Tooltip>
	);

	const isTooltip = !dragHandleDisabled && fg('platform_editor_element_drag_and_drop_ed_23873');
	const stickyRender = isTooltip ? stickyWithTooltip() : stickyWithoutTooltip();
	const render = isTooltip ? buttonWithTooltip() : renderButton();

	return editorExperiment('platform_editor_controls', 'variant1') ? stickyRender : render;
};

export const DragHandleWithVisibility = ({
	view,
	api,
	formatMessage,
	getPos,
	anchorName,
	nodeType,
	handleOptions,
	anchorRectCache,
}: DragHandleProps) => {
	return (
		<VisibilityContainer api={api}>
			<DragHandle
				view={view}
				api={api}
				formatMessage={formatMessage}
				getPos={getPos}
				anchorName={anchorName}
				nodeType={nodeType}
				handleOptions={handleOptions}
				anchorRectCache={anchorRectCache}
			/>
		</VisibilityContainer>
	);
};
