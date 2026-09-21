/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type DragEvent,
	type MouseEvent,
} from 'react';

import { cssMap as compiledCssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

// oxlint-disable-next-line typescript/consistent-type-imports -- jsx is the runtime factory for the classic JSX pragma above.
import { jsx } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import { surfaceDragHandleElementStore } from '@atlaskit/editor-common/block-controls/surface-drag-handle-element';
import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { TooltipContentWithMultipleShortcuts } from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { selectionPreservationPluginKey } from '../pm-plugins/selection-preservation/plugin-key';
import { prepareCollapsedHeadingSelection } from '../pm-plugins/utils/collapsed-heading';
import { expandAndUpdateSelection } from '../pm-plugins/utils/expand-and-update-selection';
import { isHandleCorrelatedToSelection } from '../pm-plugins/utils/getSelection';
import { buildLayoutColumnMenuMeta } from './block-controls-surface-drag-handle-utils';
import { DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH } from './consts';
import { DragHandleNestedIcon } from './drag-handle-nested-icon';
import { shouldUseNestedDragHandleIcon } from './should-use-nested-drag-handle-icon';
import { useSurfaceEditorView } from './surface-editor-view-context';
import { useBlockControlsSurfaceDragSource } from './use-block-controls-surface-drag-source';
import { getAnchorAttrName, NODE_ANCHOR_ATTR_NAME } from './utils/dom-attr-name';

// Keep style values co-located for Compiled while matching the legacy drag handle dimensions.
const SURFACE_DRAG_HANDLE_HEIGHT = 24;
const SURFACE_DRAG_HANDLE_WIDTH = 12;
const SURFACE_DRAG_HANDLE_BORDER_RADIUS = 4;
const SURFACE_DRAG_HANDLE_Z_INDEX = 100;

const dragHandleStyles = compiledCssMap({
	root: {
		display: 'flex',
		boxSizing: 'border-box',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: SURFACE_DRAG_HANDLE_HEIGHT,
		width: SURFACE_DRAG_HANDLE_WIDTH,
		border: 'none',
		borderRadius: SURFACE_DRAG_HANDLE_BORDER_RADIUS,
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.icon.subtle'),
		cursor: 'grab',
		zIndex: SURFACE_DRAG_HANDLE_Z_INDEX,
		outline: 'none',
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			transition: token('motion.button.pressed'),
		},
		'&:focus-visible': {
			outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
		},
		'&:disabled': {
			backgroundColor: 'transparent',
			color: token('color.icon.disabled'),
		},
		'&:disabled:hover': {
			backgroundColor: token('color.background.disabled'),
		},
		transition: token('motion.button.hovered'),
	},
	// Keep these expressions static so Compiled can extract the cssMap at build time.
	scaled: {
		height: 'calc(24 * var(--ak-editor-base-font-size) / 16)',
		width: 'calc(12 * var(--ak-editor-base-font-size) / 16)',
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		color: token('color.icon.selected'),
	},
	keyboardFocused: {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
	},
	firefoxSelection: {
		'&::selection': {
			backgroundColor: 'transparent',
		},
	},
	layoutColumn: {
		transform: 'rotate(90deg)',
	},
	iconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

const handleIconDragStart = (event: DragEvent<HTMLSpanElement>) => {
	if (!getBrowserInfo().chrome) {
		return;
	}
	event.stopPropagation();
	event.currentTarget.parentElement?.dispatchEvent(
		new DragEvent('dragstart', {
			bubbles: true,
			cancelable: true,
			dataTransfer: event.dataTransfer,
		}),
	);
};

type Props = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	surfaceContext?: SurfaceContext;
};

const isSelected = (
	selection: Selection | undefined,
	pos: number | undefined,
	view: EditorView | undefined,
): boolean => {
	if (typeof pos !== 'number' || !selection || !view) {
		return false;
	}

	return isHandleCorrelatedToSelection(view.state, selection, pos);
};

export const BlockControlsSurfaceDragHandle = ({
	api,
	surfaceContext,
}: Props): jsx.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const view = useSurfaceEditorView();
	const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
	const activeNode = context?.activeNode;
	const pos = activeNode?.pos;
	const nodeType = activeNode?.type.name ?? '';
	const buttonRef = useRef<HTMLButtonElement>(null);
	const posRef = useRef(pos);
	posRef.current = pos;
	const getPos = useCallback(() => posRef.current, []);

	const { activeNodeAnchorName, handleOptions, interactionState, isShiftDown, selection } =
		useSharedPluginStateWithSelector(
			api,
			['blockControls', 'interaction', 'selection'],
			(states) => ({
				activeNodeAnchorName: states.blockControlsState?.activeNode?.anchorName,
				handleOptions: states.blockControlsState?.activeNode?.handleOptions,
				interactionState: states.interactionState?.interactionState,
				isShiftDown: states.blockControlsState?.isShiftDown,
				selection: states.selectionState?.selection,
			}),
		);
	const [dragHandleSelected, setDragHandleSelected] = useState(false);

	useEffect(() => {
		setDragHandleSelected(isSelected(selection, pos, view));
	}, [pos, selection, view]);

	const isLayoutColumn = nodeType === 'layoutColumn';
	const isTopLevelNode = activeNode?.parentType === 'doc';
	const isDisabled = useMemo(() => {
		if (
			!isShiftDown ||
			!view ||
			view.state.selection.empty ||
			!fg('platform_editor_elements_dnd_shift_click_select')
		) {
			return false;
		}
		if (isLayoutColumn && expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)) {
			return false;
		}

		const multiSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
		const $anchor =
			multiSelect?.anchor !== undefined
				? view.state.doc.resolve(multiSelect.anchor)
				: view.state.selection.$anchor;
		return !isTopLevelNode || $anchor.depth > DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH;
	}, [api, isLayoutColumn, isShiftDown, isTopLevelNode, view]);

	const getAnchorName = useCallback((): string => {
		const surfaceAnchor =
			posRef.current === undefined
				? undefined
				: api?.blockControls.sharedState.currentState()?.surfaceAnchors?.get(posRef.current);
		if (surfaceAnchor) {
			return surfaceAnchor;
		}
		if (activeNodeAnchorName) {
			return activeNodeAnchorName;
		}
		const currentPos = posRef.current;
		if (!view || currentPos === undefined) {
			return '';
		}
		const dom = view.nodeDOM(currentPos);
		if (!(dom instanceof HTMLElement)) {
			return '';
		}
		const anchorAttrName = getAnchorAttrName();
		return (
			dom.getAttribute(anchorAttrName) ??
			dom.getAttribute(NODE_ANCHOR_ATTR_NAME) ??
			dom.closest(`[${anchorAttrName}]`)?.getAttribute(anchorAttrName) ??
			''
		);
	}, [activeNodeAnchorName, api, view]);

	useLayoutEffect(() => {
		const element = buttonRef.current;
		if (!view || !element) {
			return;
		}
		surfaceDragHandleElementStore.set(view, element);
		return () => surfaceDragHandleElementStore.release(view, element);
	}, [view]);

	useEffect(() => {
		if (!handleOptions?.isFocused || !buttonRef.current || !view) {
			return;
		}

		let animationFrameId: number | undefined;
		let attempts = 0;
		const focusHandle = () => {
			const button = buttonRef.current;
			if (!button) {
				return;
			}
			button.focus();
			if (button.ownerDocument.activeElement !== button && attempts < 5) {
				attempts++;
				animationFrameId = requestAnimationFrame(focusHandle);
			}
		};

		focusHandle();
		return () => {
			if (animationFrameId !== undefined) {
				cancelAnimationFrame(animationFrameId);
			}
			view.focus();
		};
	}, [handleOptions?.isFocused, view]);

	useBlockControlsSurfaceDragSource({
		api,
		elementRef: buttonRef,
		getAnchorName,
		getPos,
		nodeType,
		start: pos,
		view,
	});

	const handleMouseDown = useCallback(() => {
		api?.core?.actions.execute(api?.blockControls?.commands.setSelectedViaDragHandle(true));
	}, [api]);

	const handleClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			if (!view || isDisabled) {
				return;
			}
			const openedViaKeyboard = event.detail === 0;
			api?.core?.actions.execute(({ tr }) => {
				const startPos = getPos();
				if (startPos === undefined) {
					return tr;
				}

				if (
					nodeType === 'layoutColumn' &&
					expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)
				) {
					tr.setMeta(
						'toggleLayoutColumnMenu',
						buildLayoutColumnMenuMeta(startPos, openedViaKeyboard),
					);
				}

				const selection =
					selectionPreservationPluginKey.getState(view.state)?.preservedSelection ?? tr.selection;
				const resolvedStartPos = tr.doc.resolve(startPos);
				api?.analytics?.actions.attachAnalyticsEvent({
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
					attributes: {
						nodeDepth: resolvedStartPos.depth,
						nodeTypes: resolvedStartPos.nodeAfter?.type.name || '',
					},
					eventType: EVENT_TYPE.UI,
				})(tr);

				expandAndUpdateSelection({
					api,
					isShiftPressed: event.shiftKey,
					nodeType,
					selection,
					startPos,
					tr,
				});
				if (isExperimentEnabled('platform_editor_collapsible_headings')) {
					prepareCollapsedHeadingSelection({
						api,
						expand: true,
						headingPos: startPos,
						tr,
					});
				}
				api?.blockControls?.commands.startPreservingSelection()({ tr });
				api?.blockControls?.commands.toggleBlockMenu({
					anchorName: getAnchorName(),
					openedViaKeyboard,
					triggerByNode: {
						nodeType,
						pos: startPos,
						rootPos: activeNode?.rootPos ?? resolvedStartPos.before(1),
					},
				})({ tr });
				tr.setMeta('scrollIntoView', false);
				return tr;
			});
			view.focus();
		},
		[activeNode?.rootPos, api, getAnchorName, getPos, isDisabled, nodeType, view],
	);
	const label = formatMessage(blockControlsMessages.dragToMoveClickToOpen, { br: ' ' });
	const helpDescriptors = useMemo(
		() => [
			{
				description: formatMessage(blockControlsMessages.dragToMoveClickToOpen, {
					br: <br />,
				}),
			},
		],
		[formatMessage],
	);
	const handleTooltipShow = useCallback(() => {
		api?.accessibilityUtils?.actions.ariaNotify(label, { priority: 'important' });
	}, [api, label]);

	if (!view || !activeNode || pos === undefined) {
		return null;
	}

	const tooltipContent = <TooltipContentWithMultipleShortcuts helpDescriptors={helpDescriptors} />;
	const browser = getBrowserInfo();
	const button = (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button -- The editor drag handle has a deliberately narrow, scalable hitbox that ADS IconButton does not provide.
		<button
			ref={buttonRef}
			type="button"
			aria-label={label}
			css={[
				dragHandleStyles.root,
				browser.gecko && dragHandleStyles.firefoxSelection,
				isLayoutColumn && dragHandleStyles.layoutColumn,
				dragHandleSelected &&
					interactionState !== 'hasNotHadInteraction' &&
					dragHandleStyles.selected,
				handleOptions?.isFocused && dragHandleStyles.keyboardFocused,
				dragHandleStyles.scaled,
			]}
			disabled={isDisabled}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop -- Pragmatic DnD owns this native drag source.
			onDrop={(event) => event.stopPropagation()}
			data-editor-block-ctrl-drag-handle
			data-blocks-drag-handle={fg('confluence_remix_button_right_side_block_fg') || undefined}
			data-testid="block-controls-surface-drag-handle"
		>
			{/* eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop -- Mirrors the legacy Chrome drag-start forwarding workaround. */}
			<span css={dragHandleStyles.iconWrapper} onDragStart={handleIconDragStart}>
				{shouldUseNestedDragHandleIcon(Boolean(isTopLevelNode), isLayoutColumn) ? (
					<DragHandleNestedIcon />
				) : (
					<DragHandleVerticalIcon label="" size="small" spacing="spacious" />
				)}
			</span>
		</button>
	);

	return (
		<Tooltip
			position="top"
			content={tooltipContent}
			ignoreTooltipPointerEvents
			onShow={handleTooltipShow}
		>
			{button}
		</Tooltip>
	);
};
