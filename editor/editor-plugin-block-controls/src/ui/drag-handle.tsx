/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type DragEvent,
	type KeyboardEvent,
	type MouseEvent,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import type { IntlShape } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { getBrowserInfo } from '@atlaskit/editor-common/browser';
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
import { DRAG_HANDLE_WIDTH, tableControlsSpacing } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFullPageNarrowBreakout,
	akEditorTableToolbarSize,
	relativeSizeToBaseFontSize,
} from '@atlaskit/editor-shared-styles/consts';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
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

import type { BlockControlsPlugin, HandleOptions, TriggerByNode } from '../blockControlsPluginType';
import { getNodeTypeWithLevel } from '../pm-plugins/decorations-common';
import { key } from '../pm-plugins/main';
import { selectionPreservationPluginKey } from '../pm-plugins/selection-preservation/plugin-key';
import { getMultiSelectAnalyticsAttributes } from '../pm-plugins/utils/analytics';
import type { AnchorRectCache } from '../pm-plugins/utils/anchor-utils';
import {
	getControlBottomCSSValue,
	getControlHeightCSSValue,
	getLeftPosition,
	getNodeHeight,
	getTopPosition,
	shouldBeSticky,
	shouldMaskNodeControls,
} from '../pm-plugins/utils/drag-handle-positions';
import { expandAndUpdateSelection } from '../pm-plugins/utils/expand-and-update-selection';
import { isHandleCorrelatedToSelection, selectNode } from '../pm-plugins/utils/getSelection';
import {
	alignAnchorHeadInDirectionOfPos,
	expandSelectionHeadToNodeAtPos,
} from '../pm-plugins/utils/selection';

import {
	ACTIVE_DRAG_HANDLE_ATTR,
	DRAG_HANDLE_BORDER_RADIUS,
	DRAG_HANDLE_HEIGHT,
	DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH,
	DRAG_HANDLE_ZINDEX,
	dragHandleGap,
	nodeMargins,
	spacingBetweenNodesForPreview,
	STICKY_CONTROLS_TOP_MARGIN,
	STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER,
	topPositionAdjustment,
} from './consts';
import { DragHandleNestedIcon } from './drag-handle-nested-icon';
import { dragPreview, type DragPreviewContent } from './drag-preview';
import { shouldUseNestedDragHandleIcon } from './should-use-nested-drag-handle-icon';
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
			marginBottom: token('space.negative.200'),
			paddingBottom: token('space.200'),
			marginTop: token('space.negative.400'),
			paddingTop: `calc(${token('space.400')} - 1px)`,
			marginRight: token('space.negative.150'),
			paddingRight: token('space.150'),
			boxSizing: 'border-box',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			background: `linear-gradient(to bottom, ${token('elevation.surface')} 90%, transparent)`,
			marginBottom: token('space.negative.200'),
			paddingBottom: token('space.200'),
			marginTop: token('space.negative.400'),
			paddingTop: `calc(${token('space.400')} - 1px)`,
			marginRight: token('space.negative.150'),
			paddingRight: token('space.150'),
			boxSizing: 'border-box',
		},
});

// EDITOR-6790 - When the `platform_editor_table_col_insert` experiment is enabled,
// drop the linear-gradient background that paints over the legacy `tr.sticky` table
// header so the new left-edge column-insert affordance is not visually clipped.
// Keep all paddings / margins identical to `buttonWrapperStyles` so the drag-handle
// layout does not shift between the two variants.
const buttonWrapperStylesNoBackground = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			marginBottom: token('space.negative.200'),
			paddingBottom: token('space.200'),
			marginTop: token('space.negative.400'),
			paddingTop: `calc(${token('space.400')} - 1px)`,
			marginRight: token('space.negative.150'),
			paddingRight: token('space.150'),
			boxSizing: 'border-box',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			marginBottom: token('space.negative.200'),
			paddingBottom: token('space.200'),
			marginTop: token('space.negative.400'),
			paddingTop: `calc(${token('space.400')} - 1px)`,
			marginRight: token('space.negative.150'),
			paddingRight: token('space.150'),
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
	color: token('color.icon'),
	cursor: 'grab',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: DRAG_HANDLE_ZINDEX,
	outline: 'none',
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},

	'&:disabled': {
		color: token('color.icon.disabled'),
		backgroundColor: 'transparent',
	},

	'&:hover:disabled': {
		backgroundColor: token('color.background.disabled'),
	},
});

// Calculate scaled dimensions based on the base font size using CSS calc()
// Default font size is 16px, scale proportionally
// Standard: 16px -> 24h x 12w, Dense: 13px -> 18h x 9w, Jira: 14px -> 21h x 12w
const dragHandleButtonScaledStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	height: relativeSizeToBaseFontSize(DRAG_HANDLE_HEIGHT),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: relativeSizeToBaseFontSize(DRAG_HANDLE_WIDTH),
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
	paddingTop: `${token('space.025')}`,
	paddingBottom: `${token('space.025')}`,
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
	color: token('color.icon'),
	cursor: 'grab',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: DRAG_HANDLE_ZINDEX,
	outline: 'none',

	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},

	'&:focus': {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
	},

	'&:disabled': {
		color: token('color.icon.disabled'),
		backgroundColor: 'transparent',
	},

	'&:hover:disabled': {
		backgroundColor: token('color.background.disabled'),
	},
});

const focusedStylesOld = css({
	'&:focus': {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
	},
});

const focusedStyles = css({
	'&:focus-visible': {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
	},
});

const keyboardFocusedDragHandleStyles = css({
	outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
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

const tooltipContainerStylesImprovedStickyHeaderWithMask = css({
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-mark-name="fragment"] >[data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: tableControlsSpacing,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-mark-name="fragment"] >[data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: tableControlsSpacing,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-node-name="table"] tr.pm-table-row-native-sticky.pm-table-row-native-sticky-active) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: `${STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-node-name="table"] tr.pm-table-row-native-sticky.pm-table-row-native-sticky-active) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: `${STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-drag-handle-container]:has(+ [data-prosemirror-mark-name="fragment"] >[data-prosemirror-node-name="table"] tr.pm-table-row-native-sticky.pm-table-row-native-sticky-active) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: `${STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-drag-handle-container]):has(+ [data-prosemirror-mark-name="fragment"] > [data-prosemirror-node-name="table"] tr.pm-table-row-native-sticky.pm-table-row-native-sticky-active) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: `${STICKY_CONTROLS_TOP_MARGIN_FOR_STICKY_HEADER}px`,
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
	backgroundColor: token('color.background.selected'),
	color: token('color.icon.selected'),
});

// [Chrome only] When selection contains multiple nodes and then drag a drag handle that is within the selection range,
// icon span receives dragStart event, instead of button, and since it is not registered as a draggable element
// with pragmatic DnD and pragmatic DnD is not triggered
const handleIconDragStart = (e: DragEvent<HTMLSpanElement>) => {
	const browser = getBrowserInfo();
	if (!browser.chrome) {
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

// Kill switch OFF: omit `isOpen` so the reducer toggles per clicked column. ON: keep
// `isOpen: true` for legacy always-open. Centralised so all dispatch sites stay in sync.
const buildToggleLayoutColumnMenuMeta = (anchorPos: number, openedViaKeyboard: boolean) => ({
	anchorPos,
	...(fg('platform_editor_layout_column_menu_kill_switch_1') ? { isOpen: true } : {}),
	openedViaKeyboard,
});

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
}: DragHandleProps): jsx.JSX.Element => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const mouseDownRef = useRef(false);
	const [dragHandleSelected, setDragHandleSelected] = useState(false);
	const [dragHandleDisabled, setDragHandleDisabled] = useState(false);
	const [blockCardWidth, setBlockCardWidth] = useState(768);
	const [positionStylesOld, setPositionStylesOld] = useState<CSSProperties>({ display: 'none' });
	// Tracks whether the initial position calculation has been performed at least once.
	// The reliable-anchor early-return optimisation must not fire before the first calculation,
	// otherwise positionStylesOld stays as { display: 'none' } and the handle is never shown.
	const hasCalculatedInitialPosition = useRef(false);
	const [isFocused, setIsFocused] = useState(Boolean(handleOptions?.isFocused));
	const { macroInteractionUpdates, selection, isShiftDown, interactionState, currentUserIntent } =
		useSharedPluginStateWithSelector(
			api,
			['featureFlags', 'selection', 'blockControls', 'interaction', 'userIntent'],
			(states) => ({
				macroInteractionUpdates: states.featureFlagsState?.macroInteractionUpdates,
				selection: states.selectionState?.selection,
				isShiftDown: states.blockControlsState?.isShiftDown,
				interactionState: states.interactionState?.interactionState,
				currentUserIntent: states.userIntentState?.currentUserIntent,
			}),
		);

	const start = getPos();
	const isLayoutColumn = nodeType === 'layoutColumn';

	// Dynamically calculate if node is top-level based on current position (gated by experiment)
	const isTopLevelNodeDynamic = useMemo(() => {
		if (!expValEquals('platform_editor_nested_drag_handle_icon', 'isEnabled', true)) {
			return isTopLevelNode;
		}
		const pos = getPos();
		if (typeof pos === 'number') {
			const $pos = view.state.doc.resolve(pos);
			return $pos?.parent.type.name === 'doc';
		}
		return true;
	}, [getPos, view.state.doc, isTopLevelNode]);

	// Use the dynamic value when experiment is on, otherwise use the prop
	// When cleaning up the experiment, you can safely remove the isTopLevelNode as an prop and
	// just rely on the dynamic value (rename it to isTopLevelNode for simplicitiy)
	const isTopLevelNodeValue = expValEquals(
		'platform_editor_nested_drag_handle_icon',
		'isEnabled',
		true,
	)
		? isTopLevelNodeDynamic
		: isTopLevelNode;

	useEffect(() => {
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

	useEffect(() => {
		if (
			!expValEqualsNoExposure('platform_editor_selection_toolbar_block_handle', 'isEnabled', true)
		) {
			return;
		}

		const unbind = bind(window, {
			type: 'mouseUp',
			listener: () => (mouseDownRef.current = false),
		});
		return () => unbind();
	}, []);

	const handleMouseDown = useCallback(() => {
		mouseDownRef.current = true;
	}, []);

	const handleMouseUp = useCallback((e: MouseEvent<HTMLButtonElement>) => {
		// Stop propagation so that for drag handles in nested scenarios the click is captured
		// and doesn't propagate to the edge of the element and trigger a node selection
		// on the parent element
		if (
			!expValEqualsNoExposure('platform_editor_selection_toolbar_block_handle', 'isEnabled', true)
		) {
			e.stopPropagation();
		}

		// Fixes bug where selection toolbar is blocked when mouse is released on drag handle
		if (mouseDownRef.current) {
			e.stopPropagation();
		}
	}, []);

	const handleOnClickNew = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			api?.core?.actions.execute(({ tr }) => {
				const startPos = getPos();
				if (startPos === undefined) {
					return tr;
				}

				if (
					nodeType === 'layoutColumn' &&
					expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)
				) {
					tr.setMeta('toggleLayoutColumnMenu', buildToggleLayoutColumnMenuMeta(startPos, false));
				}

				const resolvedStartPos = tr.doc.resolve(startPos);

				const selection =
					selectionPreservationPluginKey.getState(view.state)?.preservedSelection || tr.selection;
				api?.analytics?.actions.attachAnalyticsEvent({
					eventType: EVENT_TYPE.UI,
					action: ACTION.CLICKED,
					actionSubject: ACTION_SUBJECT.BUTTON,
					actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
					attributes: {
						nodeDepth: resolvedStartPos.depth,
						nodeTypes: resolvedStartPos.nodeAfter?.type.name || '',
					},
				})(tr);

				expandAndUpdateSelection({
					tr,
					selection,
					startPos,
					isShiftPressed: e.shiftKey,
					nodeType,
					api,
				});

				api?.blockControls?.commands.startPreservingSelection()({ tr });

				api?.blockControls?.commands.toggleBlockMenu({
					anchorName,
					openedViaKeyboard: false,
					triggerByNode: editorExperiment('platform_synced_block', true)
						? { nodeType, pos: startPos, rootPos: tr.doc.resolve(startPos).before(1) }
						: undefined,
				})({ tr });

				tr.setMeta('scrollIntoView', false);

				return tr;
			});

			view.focus();
		},
		[api, view, getPos, nodeType, anchorName],
	);

	const handleOnClick = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			api?.core?.actions.execute(({ tr }) => {
				const startPos = getPos();
				if (startPos === undefined) {
					return tr;
				}

				if (
					nodeType === 'layoutColumn' &&
					expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)
				) {
					tr.setMeta('toggleLayoutColumnMenu', buildToggleLayoutColumnMenuMeta(startPos, false));
				}

				const mSelect = api?.blockControls.sharedState.currentState()?.multiSelectDnD;
				const $anchor =
					mSelect?.anchor !== undefined ? tr.doc.resolve(mSelect?.anchor) : tr.selection.$anchor;
				if (tr.selection.empty || !e.shiftKey) {
					tr = selectNode(tr, startPos, nodeType, api);
				} else if (
					isTopLevelNodeValue &&
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
						nodeTypes: maybeNode?.type.name || '',
					},
				})(tr);
				return tr;
			});

			view.focus();
		},
		[api, view, getPos, isTopLevelNodeValue, nodeType],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
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
					return tr;
				});
			} else if (![e.altKey, e.ctrlKey, e.shiftKey].some((pressed) => pressed)) {
				// If not trying to press shortcut keys,
				// return focus to editor to resume editing from caret position
				view.focus();
			}
		},
		[getPos, api?.core?.actions, view],
	);

	const handleKeyDownNew = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			// allow user to use spacebar to select the node
			if (e.key === 'Enter' || (!e.repeat && e.key === ' ')) {
				if (getDocument()?.activeElement !== buttonRef.current) {
					return;
				}

				e.preventDefault();
				e.stopPropagation();

				const startPos = getPos();
				api?.core?.actions.execute(({ tr }) => {
					if (startPos === undefined) {
						return tr;
					}

					const selection =
						selectionPreservationPluginKey.getState(view.state)?.preservedSelection || tr.selection;

					expandAndUpdateSelection({
						tr,
						selection,
						startPos,
						isShiftPressed: e.shiftKey,
						nodeType,
						api,
					});

					api?.blockControls?.commands.startPreservingSelection()({ tr });

					if (
						nodeType === 'layoutColumn' &&
						expValEquals('platform_editor_layout_column_menu', 'isEnabled', true)
					) {
						tr.setMeta('toggleLayoutColumnMenu', buildToggleLayoutColumnMenuMeta(startPos, true));
					}

					const rootPos = editorExperiment('platform_synced_block', true)
						? tr.doc.resolve(startPos).before(1)
						: undefined;
					const triggerByNode: TriggerByNode | undefined = editorExperiment(
						'platform_synced_block',
						true,
					)
						? { nodeType, pos: startPos, rootPos }
						: undefined;
					api?.blockControls?.commands.toggleBlockMenu({
						anchorName,
						triggerByNode,
						openedViaKeyboard: true,
					})({
						tr,
					});
					api?.userIntent?.commands.setCurrentUserIntent('blockMenuOpen')({ tr });
					return tr;
				});
				view.focus();
			} else if (![e.altKey, e.ctrlKey, e.shiftKey].some((pressed) => pressed)) {
				// If not trying to press shortcut keys,
				// return focus to editor to resume editing from caret position
				view.focus();
			}
		},
		[getPos, api, nodeType, anchorName, view],
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
				api?.core?.actions.execute(({ tr }) => {
					const handlePos = getPos();
					if (typeof handlePos !== 'number') {
						return tr;
					}
					const newHandlePosCheck = isHandleCorrelatedToSelection(
						view.state,
						tr.selection,
						handlePos,
					);
					if (!tr.selection.empty && newHandlePosCheck) {
						api?.blockControls?.commands.setMultiSelectPositions()({ tr });
					} else {
						tr = selectNode(tr, handlePos, nodeType, api);
					}

					return tr;
				});

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
							expandedSlice.content.descendants((node, pos) => {
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
							nodeTypes: nodeTypes || '',
							hasSelectedMultipleNodes,
						},
					})(tr);
					return tr;
				});

				view.focus();
			},
		});
	}, [anchorName, api, getPos, nodeType, start, view]);

	const calculatePositionOld = useCallback(() => {
		const pos = getPos();
		const $pos = expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)
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

		// Defence-in-depth guard: since the node decoration sets data-active-drag-handle on the
		// active node, we check for it directly. This is a cheap DOM attribute read (no reflow,
		// no style recalculation) and hides the control if the decoration hasn't been applied yet.
		if (
			expValEquals('platform_editor_controls_reliable_anchor', 'isEnabled', true) &&
			!dom?.hasAttribute(ACTIVE_DRAG_HANDLE_ATTR)
		) {
			return { display: 'none' };
		}

		const hasResizer = nodeType === 'table' || nodeType === 'mediaSingle';
		const isExtension =
			nodeType === 'extension' ||
			nodeType === 'bodiedExtension' ||
			(nodeType === 'multiBodiedExtension' && fg('confluence_frontend_native_tabs_extension'));
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
				? getControlBottomCSSValue(safeAnchorName, isSticky, isTopLevelNodeValue, isLayoutColumn)
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
								expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)
									? ($pos && $pos.nodeAfter && getNodeTypeWithLevel($pos.nodeAfter)) || nodeType
									: nodeType,
								dom?.getAttribute('layout') || '',
							)}px)`,

				...bottom,
			};
		}

		const height = editorExperiment('platform_editor_controls', 'variant1')
			? getControlHeightCSSValue(
					getNodeHeight(dom, safeAnchorName, anchorRectCache) || 0,
					isSticky,
					isTopLevelNodeValue,
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
		isTopLevelNodeValue,
		isLayoutColumn,
	]);

	const isReliableAnchorEnabled = expValEquals(
		'platform_editor_controls_reliable_anchor',
		'isEnabled',
		true,
	);
	const docDepForReliableAnchor = isReliableAnchorEnabled ? view.state.doc : undefined;

	// Effect 1 (reliable-anchor ON): fires when non-doc deps change (e.g. blockCardWidth,
	// anchorRectCache, macroInteractionUpdates, isTopLevelNodeValue, isLayoutColumn via
	// calculatePositionOld) — always recalculates without the doc guard, so non-doc position
	// changes are never incorrectly skipped.
	useEffect(() => {
		if (!isReliableAnchorEnabled) {
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
			hasCalculatedInitialPosition.current = true;
		});

		return () => {
			cancelAnimationFrame(calcPos);
			cleanUpTransitionListener?.();
		};
	}, [isReliableAnchorEnabled, calculatePositionOld, view.dom, anchorName, nodeType]);

	// Effect 2 (reliable-anchor ON): fires when the doc changes — carries the DOM-attribute
	// guard to skip recalc when a drag handle is active (pure keystroke during drag).
	// Effect (reliable-anchor OFF): single combined effect, original behaviour.
	useEffect(() => {
		if (isReliableAnchorEnabled) {
			// Doc-change only effect: apply the DOM-attribute guard.
			// React's dep comparison already ensures this only runs when docDepForReliableAnchor
			// (i.e. view.state.doc) changed, so no manual ref tracking is needed.
			if (!hasCalculatedInitialPosition.current) {
				return;
			}

			const calcPos = requestAnimationFrame(() => {
				const dom = view.dom.querySelector(`[${getAnchorAttrName()}="${anchorName}"]`);
				if (dom?.hasAttribute(ACTIVE_DRAG_HANDLE_ATTR)) {
					return;
				}
				setPositionStylesOld(calculatePositionOld());
			});

			return () => {
				cancelAnimationFrame(calcPos);
			};
		}

		// reliable-anchor OFF: original single-effect behaviour (no guard).
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
			hasCalculatedInitialPosition.current = true;
		});

		return () => {
			cancelAnimationFrame(calcPos);
			cleanUpTransitionListener?.();
		};
	}, [
		isReliableAnchorEnabled,
		calculatePositionOld,
		view.dom,
		anchorName,
		nodeType,
		docDepForReliableAnchor,
	]);

	useEffect(() => {
		if (handleOptions?.isFocused && buttonRef.current) {
			const id = requestAnimationFrame(() => {
				buttonRef.current?.focus();
			});
			return () => {
				cancelAnimationFrame(id);
				view.focus();
			};
		}
	}, [buttonRef, handleOptions?.isFocused, view]);

	useEffect(() => {
		if (typeof start !== 'number' || !selection) {
			return;
		}

		setDragHandleSelected(isHandleCorrelatedToSelection(view.state, selection, start));
	}, [start, selection, view]);

	useEffect(() => {
		if (
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
		const isLayoutColumnMenuEnabled = expValEquals(
			'platform_editor_layout_column_menu',
			'isEnabled',
			true,
		);
		if (
			isShiftDown &&
			!(isLayoutColumnMenuEnabled && isLayoutColumn) &&
			(!isTopLevelNodeValue ||
				(isTopLevelNodeValue && $anchor.depth > DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH))
		) {
			setDragHandleDisabled(true);
		} else {
			setDragHandleDisabled(false);
		}
	}, [api?.blockControls?.sharedState, isLayoutColumn, isShiftDown, isTopLevelNodeValue, view]);

	const dragHandleMessage = editorExperiment('platform_editor_block_menu', true)
		? formatMessage(blockControlsMessages.dragToMoveClickToOpen, { br: <br /> })
		: formatMessage(blockControlsMessages.dragToMove);

	// Create a string version for aria-label
	const dragHandleAriaLabel = expValEquals('platform_editor_block_menu', 'isEnabled', true)
		? formatMessage(blockControlsMessages.dragToMoveClickToOpen, { br: ' ' })
		: formatMessage(blockControlsMessages.dragToMove);

	let helpDescriptors = isTopLevelNodeValue
		? [
				{
					description: dragHandleMessage,
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
					description: dragHandleMessage,
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

	if (!isTopLevelNodeValue) {
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
				description: dragHandleMessage,
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
		event.stopPropagation();
	};

	const hasHadInteraction = interactionState !== 'hasNotHadInteraction';

	const browser = getBrowserInfo();

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
				editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
					editorExperiment('platform_editor_controls', 'control') &&
					dragHandleButtonSmallScreenStyles,
				editorExperiment('platform_editor_block_menu', true) &&
					isFocused &&
					keyboardFocusedDragHandleStyles,
				editorExperiment('platform_editor_block_menu', true) ? focusedStyles : focusedStylesOld,
				dragHandleButtonScaledStyles,
			]}
			ref={buttonRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={!editorExperiment('platform_editor_controls', 'variant1') ? positionStylesOld : {}}
			onMouseDown={
				expValEqualsNoExposure('platform_editor_selection_toolbar_block_handle', 'isEnabled', true)
					? handleMouseDown
					: undefined
			}
			onMouseUp={editorExperiment('platform_editor_block_menu', true) ? handleMouseUp : undefined}
			onClick={
				editorExperiment('platform_editor_block_menu', true) ? handleOnClickNew : handleOnClick
			}
			onKeyDown={
				editorExperiment('platform_editor_block_menu', true) ? handleKeyDownNew : handleKeyDown
			}
			// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
			onDrop={handleOnDrop}
			disabled={dragHandleDisabled}
			data-editor-block-ctrl-drag-handle
			data-blocks-drag-handle={fg('confluence_remix_button_right_side_block_fg') || undefined}
			data-testid="block-ctrl-drag-handle"
			aria-label={dragHandleAriaLabel}
			onBlur={() => {
				if (editorExperiment('platform_editor_block_menu', true)) {
					setIsFocused(false);
				}

				if (expValEquals('platform_editor_drag_handle_keyboard_a11y', 'isEnabled', true)) {
					const pos = getPos();
					if (pos !== undefined) {
						api?.core?.actions.execute(({ tr }: { tr: Transaction }) => {
							tr.setMeta(key, {
								activeNode: {
									pos,
									anchorName,
									nodeType,
									handleOptions: { isFocused: false },
								},
							});
							return tr;
						});
					}
				}
			}}
		>
			<Box
				xcss={iconWrapperStyles}
				// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
				onDragStart={handleIconDragStart}
			>
				{shouldUseNestedDragHandleIcon(isTopLevelNodeValue, isLayoutColumn) ? (
					<DragHandleNestedIcon />
				) : (
					<DragHandleVerticalIcon spacing="spacious" label="" size="small" />
				)}
			</Box>
		</button>
	);

	const stickyWithTooltip = () => (
		<Box
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={positionStylesOld}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			xcss={[dragHandleContainerStyles]}
			as="span"
			testId="block-ctrl-drag-handle-container"
		>
			<span
				css={[
					tooltipContainerStyles,
					shouldMaskNodeControls(nodeType, isTopLevelNodeValue) &&
						(expValEquals(
							'platform_editor_table_sticky_header_improvements',
							'cohort',
							'test_with_overflow',
						) && fg('platform_editor_table_sticky_header_patch_6')
							? tooltipContainerStylesImprovedStickyHeaderWithMask
							: tooltipContainerStylesStickyHeaderWithMask),
					!shouldMaskNodeControls(nodeType, isTopLevelNodeValue) &&
						tooltipContainerStylesStickyHeaderWithoutMask,
				]}
			>
				<Tooltip
					content={tooltipContent}
					ignoreTooltipPointerEvents={true}
					position={'top'}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					onShow={() => {
						api?.accessibilityUtils?.actions.ariaNotify(message, { priority: 'important' });
					}}
				>
					<span
						css={[
							shouldMaskNodeControls(nodeType, isTopLevelNodeValue) &&
								// EDITOR-6790 - drop the masking background under the new
								// column-insert experiment so the left-edge dot is not clipped.
								(expValEquals('platform_editor_table_col_insert', 'isEnabled', true)
									? buttonWrapperStylesNoBackground
									: buttonWrapperStyles),
							buttonWrapperStylesPatch,
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
			style={positionStylesOld}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			xcss={[dragHandleContainerStyles]}
			as="span"
			testId="block-ctrl-drag-handle-container"
		>
			<span
				css={[
					tooltipContainerStyles,
					shouldMaskNodeControls(nodeType, isTopLevelNodeValue) &&
						tooltipContainerStylesStickyHeaderWithMask,
					!shouldMaskNodeControls(nodeType, isTopLevelNodeValue) &&
						tooltipContainerStylesStickyHeaderWithoutMask,
				]}
			>
				<span
					css={[
						shouldMaskNodeControls(nodeType, isTopLevelNodeValue) &&
							// EDITOR-6790 - drop the masking background under the new
							// column-insert experiment so the left-edge dot is not clipped.
							(expValEquals('platform_editor_table_col_insert', 'isEnabled', true)
								? buttonWrapperStylesNoBackground
								: buttonWrapperStyles),
						buttonWrapperStylesPatch,
					]}
				>
					{renderButton()}
				</span>
			</span>
		</Box>
	);

	const buttonWithTooltip = () => (
		<Tooltip
			content={tooltipContent}
			ignoreTooltipPointerEvents={true}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			onShow={() => {
				api?.accessibilityUtils?.actions.ariaNotify(message, { priority: 'important' });
			}}
		>
			{renderButton()}
		</Tooltip>
	);

	const tooltipContent =
		isLayoutColumn &&
		expValEquals('platform_editor_layout_column_menu', 'isEnabled', true) &&
		currentUserIntent === 'layoutColumnMenuPopupOpen' ? null : (
			<TooltipContentWithMultipleShortcuts helpDescriptors={helpDescriptors} />
		);

	const isTooltip = !dragHandleDisabled;
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
	isTopLevelNode,
	anchorRectCache,
}: DragHandleProps): jsx.JSX.Element => {
	const rightSideControlsEnabled = useSharedPluginStateWithSelector(
		api,
		['blockControls'],
		(states) => ({
			rightSideControlsEnabled: states.blockControlsState?.rightSideControlsEnabled ?? false,
		}),
	).rightSideControlsEnabled;
	// Layout column drag handles sit at the top-centre of each column, not on a left/right edge.
	// Don't restrict by hoverSide for layout columns — the drag handle should always be visible
	// when hovering anywhere over the column, regardless of which side of the layoutSection the
	// column is on. (The right-side remix button is a separate node decoration and is unaffected.)
	const isLayoutColumn = nodeType === 'layoutColumn';

	// Skip the right-side controlSide restriction for non-top-level nodes. The restriction exists
	// to avoid showing the drag handle and remix button simultaneously — but remix only applies to
	// top-level nodes, so non-top-level nodes should never be restricted.
	// Gated behind platform_editor_controls_reliable_anchor.
	const skipControlSideRestriction =
		expValEquals('platform_editor_controls_reliable_anchor', 'isEnabled', true) &&
		isTopLevelNode === false;

	return (
		<VisibilityContainer
			api={api}
			controlSide={
				!isLayoutColumn && !skipControlSideRestriction && rightSideControlsEnabled
					? 'left'
					: undefined
			}
			forceVisibleOnMouseOut={
				expValEquals('platform_editor_drag_handle_keyboard_a11y', 'isEnabled', true) &&
				!!handleOptions?.isFocused
			}
		>
			<DragHandle
				view={view}
				api={api}
				formatMessage={formatMessage}
				getPos={getPos}
				anchorName={anchorName}
				nodeType={nodeType}
				handleOptions={handleOptions}
				isTopLevelNode={isTopLevelNode}
				anchorRectCache={anchorRectCache}
			/>
		</VisibilityContainer>
	);
};
