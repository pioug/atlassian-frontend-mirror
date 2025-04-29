import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import rafSchd from 'raf-schd';
import { useIntl } from 'react-intl-next';

import type { TableEventPayload } from '@atlaskit/editor-common/analytics';
import {
	CHANGE_ALIGNMENT_REASON,
	INPUT_METHOD,
	TABLE_OVERFLOW_CHANGE_TRIGGER,
} from '@atlaskit/editor-common/analytics';
import { browser } from '@atlaskit/editor-common/browser';
import { getGuidelinesWithHighlights } from '@atlaskit/editor-common/guideline';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { focusTableResizer, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { HandleResize, HandleSize } from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { chainCommands } from '@atlaskit/editor-prosemirror/commands';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';
import { findTable } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { setTableAlignmentWithTableContentWithPosWithAnalytics } from '../pm-plugins/commands/commands-with-analytics';
import { updateWidthToWidest } from '../pm-plugins/commands/misc';
import { META_KEYS } from '../pm-plugins/table-analytics';
import { getColgroupChildrenLength } from '../pm-plugins/table-resizing/utils/colgroup';
import {
	COLUMN_MIN_WIDTH,
	TABLE_MAX_WIDTH,
	TABLE_OFFSET_IN_COMMENT_EDITOR,
} from '../pm-plugins/table-resizing/utils/consts';
import { previewScaleTable, scaleTable } from '../pm-plugins/table-resizing/utils/scale-table';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import {
	ALIGN_CENTER,
	ALIGN_START,
	normaliseAlignment,
	shouldChangeAlignmentToCenterResized,
} from '../pm-plugins/utils/alignment';
import {
	generateResizedPayload,
	generateResizeFrameRatePayloads,
	useMeasureFramerate,
} from '../pm-plugins/utils/analytics';
import {
	defaultGuidelines,
	defaultGuidelinesForPreserveTable,
	PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET,
} from '../pm-plugins/utils/guidelines';
import {
	defaultSnappingWidths,
	defaultTablePreserveSnappingWidths,
	findClosestSnap,
	PRESERVE_TABLE_SNAPPING_LENGTH_OFFSET,
} from '../pm-plugins/utils/snapping';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';
import {
	TABLE_GUIDELINE_VISIBLE_ADJUSTMENT,
	TABLE_HIGHLIGHT_GAP,
	TABLE_HIGHLIGHT_TOLERANCE,
	TABLE_SNAP_GAP,
} from '../ui/consts';
import { useInternalTablePluginStateSelector } from '../ui/hooks/useInternalTablePluginStateSelector';

interface TableResizerProps {
	width: number;
	maxWidth: number;
	containerWidth: number;
	lineLength: number;
	updateWidth: (width: number) => void;
	editorView: EditorView;
	getPos: () => number | undefined;
	node: PMNode;
	tableRef: HTMLTableElement;
	displayGuideline: (guideline: GuidelineConfig[]) => boolean;
	attachAnalyticsEvent: (payload: TableEventPayload) => ((tr: Transaction) => boolean) | undefined;
	displayGapCursor: (toggle: boolean) => boolean;
	pluginInjectionApi?: PluginInjectionAPI;
	isTableScalingEnabled?: boolean;
	isTableWithFixedColumnWidthsOptionEnabled?: boolean;
	isTableAlignmentEnabled?: boolean;
	isWholeTableInDanger?: boolean;
	isFullWidthModeEnabled?: boolean;
	shouldUseIncreasedScalingPercent?: boolean;
	isCommentEditor?: boolean;
	onResizeStop?: () => void;
	onResizeStart?: () => void;
	disabled?: boolean;
}

type ResizerNextHandler = React.ElementRef<typeof ResizerNext>;

const RESIZE_STEP_VALUE = 10;

const handles = { right: true };
const handleStyles = {
	right: {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		right: '-14px',
		marginTop: token('space.150', '12px'),
	},
};

const getResizerHandleHeight = (tableRef: HTMLTableElement | undefined): HandleSize | undefined => {
	const tableHeight = tableRef?.clientHeight ?? 0;
	/*
    - One row table height (minimum possible table height) ~ 45px
    - Two row table height ~ 90px
    - Three row table height ~ 134px

    In the if below we need to use:
    - > 46 because the height of the table can be a float number like 45.44.
    - < 96 is the height of large resize handle.
  */
	if (tableHeight >= 96) {
		return 'large';
	}

	if (tableHeight > 46) {
		return 'medium';
	}

	return 'small';
};

const getResizerMinWidth = (node: PMNode) => {
	const currentColumnCount = getColgroupChildrenLength(node);
	const minColumnWidth = Math.min(3, currentColumnCount) * COLUMN_MIN_WIDTH;
	// add an extra pixel as the scale table logic will scale columns to be tableContainerWidth - 1
	// the table can't scale past its min-width, so instead restrict table container min width to avoid that situation
	return minColumnWidth + 1;
};

/**
 * When guidelines are outside the viewport, filter them out, do not show
 * So the guideline container won't make the fabric-editor-popup-scroll-parent overflow
 * @param guidelines
 * @param containerWidth editorWidth
 * @param lineLength
 * @param isTableScalingEnabled
 * @param isFullWidthModeEnabled
 */
const getVisibleGuidelines = (
	guidelines: GuidelineConfig[],
	containerWidth: number,
	lineLength: number,
	isTableScalingEnabled: boolean,
	isFullWidthModeEnabled: boolean,
) => {
	let guidelineVisibleAdjustment = TABLE_GUIDELINE_VISIBLE_ADJUSTMENT;
	if (isTableScalingEnabled) {
		// Notes:
		// Example: containerWidth = 1244, lineLength = 1180 (used for when editor full width mode is enabled)
		// Full width/dynamic x coordinate can be float number.
		// Ex: guideline.position.x can be 590.5. So 590.5 * 2 = 1181 (not 1180).
		// For PTW we need to ensure that dynamic guideline never gets excluded: 1181 should be > width + guidelineVisibleAdjustment
		// guidelineVisibleAdjustment is set as a negative value, so we making it positive and adding + 1
		const preserve_table_widths_adjustment = -1 * PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET + 1;

		guidelineVisibleAdjustment = isFullWidthModeEnabled
			? preserve_table_widths_adjustment // guidelineVisibleAdjustment = -2, if lineLength = 1180, 1181 < 1180 + 2 is true.
			: -2 * akEditorGutterPaddingDynamic() + preserve_table_widths_adjustment; // guidelineVisibleAdjustment = -62, if containerWidth is 1244, 1181 < 1244 - 62 = 1182 is true.
	}
	const width = isTableScalingEnabled && isFullWidthModeEnabled ? lineLength : containerWidth;

	return guidelines.filter((guideline) => {
		return (
			guideline.position &&
			guideline.position.x !== undefined &&
			typeof guideline.position.x === 'number' &&
			Math.abs(guideline.position.x * 2) < width + guidelineVisibleAdjustment
		);
	});
};

export const TableResizer = ({
	children,
	width,
	maxWidth,
	containerWidth,
	lineLength,
	updateWidth,
	onResizeStop,
	onResizeStart,
	editorView,
	getPos,
	node,
	tableRef,
	displayGuideline,
	attachAnalyticsEvent,
	displayGapCursor,
	isTableScalingEnabled,
	isTableWithFixedColumnWidthsOptionEnabled,
	isTableAlignmentEnabled,
	isWholeTableInDanger,
	shouldUseIncreasedScalingPercent,
	pluginInjectionApi,
	isFullWidthModeEnabled,
	isCommentEditor,
	disabled,
}: PropsWithChildren<TableResizerProps>) => {
	const currentGap = useRef(0);
	// track resizing state - use ref over state to avoid re-render
	const isResizing = useRef(false);
	const areResizeMetaKeysPressed = useRef(false);
	const resizerRef = useRef<ResizerNextHandler>(null);
	const { tableState } = useSharedPluginState(pluginInjectionApi, ['table'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});

	// widthToWidest
	const widthToWidestSelector = useInternalTablePluginStateSelector(
		pluginInjectionApi,
		'widthToWidest',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const widthToWidest = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? widthToWidestSelector
		: (tableState as TableSharedStateInternal).widthToWidest;

	// used to reposition tooltip when table is resizing via keyboard
	const updateTooltip = React.useRef<() => void>();
	const [snappingEnabled, setSnappingEnabled] = useState(false);

	const { formatMessage } = useIntl();

	const currentSelection = editorView.state?.selection;
	const tableFromSelection = useMemo(() => {
		return findTable(currentSelection);
	}, [currentSelection]);
	const tableFromSelectionPosition = tableFromSelection?.pos;
	const isTableSelected = useMemo(() => {
		// Avoid call getPos if there is no table in the current selection,
		if (typeof tableFromSelectionPosition !== 'number') {
			return false;
		}

		let currentNodePosition: number | undefined;
		try {
			// The React Table and the ProseMirror can endup out-of-sync
			// ProseMirror always assume the DOM is not managed by other framework
			currentNodePosition = getPos();
		} catch (e) {
			logException(e as Error, {
				location: 'editor-plugin-table/table-resizer',
			});
			return false;
		}

		return tableFromSelectionPosition === currentNodePosition;
	}, [tableFromSelectionPosition, getPos]);

	const resizerMinWidth = getResizerMinWidth(node);
	const handleSize = getResizerHandleHeight(tableRef);

	const { startMeasure, endMeasure, countFrames } = useMeasureFramerate();

	const excludeGuidelineConfig = useMemo(
		() => ({
			innerGuidelines: !!isTableAlignmentEnabled,
			breakoutPoints: !!(isTableAlignmentEnabled && isFullWidthModeEnabled),
		}),
		[isFullWidthModeEnabled, isTableAlignmentEnabled],
	);

	const updateActiveGuidelines = useCallback(
		({ gap, keys }: { gap: number; keys: string[] }) => {
			if (gap !== currentGap.current) {
				currentGap.current = gap;
				const visibleGuidelines = getVisibleGuidelines(
					isTableScalingEnabled
						? defaultGuidelinesForPreserveTable(
								PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET,
								isFullWidthModeEnabled
									? lineLength + 2 * akEditorGutterPaddingDynamic()
									: containerWidth,
								excludeGuidelineConfig,
							)
						: defaultGuidelines,
					containerWidth,
					lineLength,
					Boolean(isTableScalingEnabled),
					Boolean(isFullWidthModeEnabled),
				);
				displayGuideline(getGuidelinesWithHighlights(gap, TABLE_SNAP_GAP, keys, visibleGuidelines));
			}
		},
		[
			isTableScalingEnabled,
			excludeGuidelineConfig,
			containerWidth,
			displayGuideline,
			lineLength,
			isFullWidthModeEnabled,
		],
	);

	const guidelineSnaps = useMemo(
		() =>
			snappingEnabled
				? {
						x: isTableScalingEnabled
							? defaultTablePreserveSnappingWidths(
									PRESERVE_TABLE_SNAPPING_LENGTH_OFFSET, // was hardcoded to 0, using PRESERVE_TABLE_SNAPPING_LENGTH_OFFSET instead.
									isFullWidthModeEnabled
										? lineLength + 2 * akEditorGutterPaddingDynamic()
										: containerWidth,
									excludeGuidelineConfig,
								)
							: defaultSnappingWidths,
					}
				: undefined,
		[
			snappingEnabled,
			isTableScalingEnabled,
			excludeGuidelineConfig,
			containerWidth,
			lineLength,
			isFullWidthModeEnabled,
		],
	);

	const switchToCenterAlignment = useCallback(
		(
			pos: number,
			node: PMNode,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			newWidth: any,
			state: EditorState,
			dispatch: ((tr: Transaction) => void) | undefined,
		) => {
			if (
				shouldChangeAlignmentToCenterResized(isTableAlignmentEnabled, node, lineLength, newWidth) &&
				isResizing.current
			) {
				const tableNodeWithPos = { pos, node };
				setTableAlignmentWithTableContentWithPosWithAnalytics(
					pluginInjectionApi?.analytics?.actions,
				)(
					ALIGN_CENTER,
					ALIGN_START,
					tableNodeWithPos,
					INPUT_METHOD.AUTO,
					CHANGE_ALIGNMENT_REASON.EDITOR_APPEARANCE_CHANGED,
				)(state, dispatch);
				return true;
			}

			return false;
		},
		[isTableAlignmentEnabled, lineLength, pluginInjectionApi?.analytics?.actions],
	);

	useEffect(() => {
		return () => {
			// only bring back the cursor if this table was deleted - i.e. if a user was resizing, then another
			// deleted this table
			if (isResizing.current) {
				const {
					dispatch,
					state: { tr },
				} = editorView;
				displayGapCursor(true);
				displayGuideline([]);
				tr.setMeta(tableWidthPluginKey, {
					resizing: false,
					tableLocalId: '',
					tableRef: null,
				});
				dispatch(tr);
			}
		};
	}, [editorView, displayGuideline, displayGapCursor]);

	const handleResizeStart = useCallback(() => {
		startMeasure();
		isResizing.current = true;
		const {
			dispatch,
			state: { tr },
		} = editorView;
		displayGapCursor(false);

		tr.setMeta(tableWidthPluginKey, {
			resizing: true,
			tableLocalId: node.attrs.localId,
			tableRef: tableRef,
		});
		tr.setMeta('is-resizer-resizing', true);

		tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
			name: TABLE_OVERFLOW_CHANGE_TRIGGER.RESIZED,
		});

		dispatch(tr);

		const visibleGuidelines = getVisibleGuidelines(
			isTableScalingEnabled
				? defaultGuidelinesForPreserveTable(
						PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET,
						isFullWidthModeEnabled
							? lineLength + 2 * akEditorGutterPaddingDynamic()
							: containerWidth,
						excludeGuidelineConfig,
					)
				: defaultGuidelines,
			containerWidth,
			lineLength,
			Boolean(isTableScalingEnabled),
			Boolean(isFullWidthModeEnabled),
		);

		setSnappingEnabled(displayGuideline(visibleGuidelines));
		if (onResizeStart) {
			onResizeStart();
		}
	}, [
		startMeasure,
		editorView,
		displayGapCursor,
		node.attrs.localId,
		tableRef,
		isTableScalingEnabled,
		excludeGuidelineConfig,
		containerWidth,
		lineLength,
		displayGuideline,
		onResizeStart,
		isFullWidthModeEnabled,
	]);

	const handleResize = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(originalState: any, delta: any) => {
			countFrames();
			const newWidth = originalState.width + delta.width;
			let pos: number | undefined;
			try {
				pos = getPos();
			} catch (e) {
				return;
			}
			if (typeof pos !== 'number') {
				return;
			}

			const editorContainerWidth = isFullWidthModeEnabled
				? lineLength + 2 * akEditorGutterPaddingDynamic()
				: containerWidth;

			const closestSnap =
				!isCommentEditor &&
				findClosestSnap(
					newWidth,
					isTableScalingEnabled
						? defaultTablePreserveSnappingWidths(
								PRESERVE_TABLE_SNAPPING_LENGTH_OFFSET,
								editorContainerWidth,
								excludeGuidelineConfig,
							)
						: defaultSnappingWidths,
					isTableScalingEnabled
						? defaultGuidelinesForPreserveTable(
								PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET,
								editorContainerWidth,
								excludeGuidelineConfig,
							)
						: defaultGuidelines,
					TABLE_HIGHLIGHT_GAP,
					TABLE_HIGHLIGHT_TOLERANCE,
				);

			closestSnap && updateActiveGuidelines(closestSnap);

			// When snapping to the full width guideline, resize the table to be 1800px
			const { state, dispatch } = editorView;
			const currentTableNodeLocalId = node?.attrs?.localId ?? '';

			const fullWidthGuideline = defaultGuidelinesForPreserveTable(
				PRESERVE_TABLE_GUIDELINES_LENGTH_OFFSET,
				editorContainerWidth,
				excludeGuidelineConfig,
			).filter((guideline) => guideline.isFullWidth)[0];

			const isFullWidthGuidelineActive =
				closestSnap && closestSnap.keys.includes(fullWidthGuideline.key);

			const tableMaxWidth = isCommentEditor
				? Math.floor(containerWidth - TABLE_OFFSET_IN_COMMENT_EDITOR)
				: TABLE_MAX_WIDTH;

			const shouldUpdateWidthToWidest = isCommentEditor
				? tableMaxWidth <= newWidth
				: !!isTableScalingEnabled && isFullWidthGuidelineActive;

			const previewParentWidth =
				isCommentEditor && shouldUpdateWidthToWidest ? tableMaxWidth : newWidth;

			previewScaleTable(
				tableRef,
				{
					node,
					prevNode: node,
					start: pos + 1,
					parentWidth: previewParentWidth,
				},
				editorView.domAtPos.bind(editorView),
				isTableScalingEnabled,
				isTableWithFixedColumnWidthsOptionEnabled,
				isCommentEditor,
			);

			chainCommands(
				(state, dispatch) => {
					return switchToCenterAlignment(pos, node, newWidth, state, dispatch);
				},
				updateWidthToWidest({
					[currentTableNodeLocalId]: shouldUpdateWidthToWidest,
				}),
			)(state, dispatch);

			updateWidth(shouldUpdateWidthToWidest ? tableMaxWidth : newWidth);

			return newWidth;
		},
		[
			countFrames,
			isCommentEditor,
			isTableScalingEnabled,
			isTableWithFixedColumnWidthsOptionEnabled,
			isFullWidthModeEnabled,
			excludeGuidelineConfig,
			tableRef,
			node,
			editorView,
			updateActiveGuidelines,
			containerWidth,
			lineLength,
			updateWidth,
			getPos,
			switchToCenterAlignment,
		],
	);

	const scheduleResize = useMemo(() => rafSchd(handleResize), [handleResize]);

	const handleResizeStop = useCallback<HandleResize>(
		(originalState, delta) => {
			isResizing.current = false;
			let newWidth: number | undefined = originalState.width + delta.width;
			const originalNewWidth = newWidth;
			const { state, dispatch } = editorView;
			const pos = getPos();
			const currentTableNodeLocalId = node?.attrs?.localId ?? '';

			const tableMaxWidth = isCommentEditor
				? undefined // Table's full-width in comment appearance inherit the width of the Editor/Renderer
				: TABLE_MAX_WIDTH;

			newWidth =
				widthToWidest && currentTableNodeLocalId && widthToWidest[currentTableNodeLocalId]
					? tableMaxWidth
					: newWidth;

			let tr = state.tr.setMeta(tableWidthPluginKey, {
				resizing: false,
				tableLocalId: '',
				tableRef: null,
			});
			tr.setMeta('is-resizer-resizing', false);
			const frameRateSamples = endMeasure();

			if (frameRateSamples.length > 0) {
				const resizeFrameRatePayloads = generateResizeFrameRatePayloads({
					docSize: state.doc.nodeSize,
					frameRateSamples,
					originalNode: node,
				});
				resizeFrameRatePayloads.forEach((payload) => {
					attachAnalyticsEvent(payload)?.(tr);
				});
			}

			if (typeof pos === 'number') {
				tr = tr.setNodeMarkup(pos, undefined, {
					...node.attrs,
					width: newWidth,
					layout:
						node.attrs.layout !== ALIGN_START && node.attrs.layout !== ALIGN_CENTER
							? ALIGN_CENTER
							: node.attrs.layout,
				});

				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const newNode = tr.doc.nodeAt(pos)!;
				tr = scaleTable(
					tableRef,
					{
						node: newNode,
						prevNode: node,
						start: pos + 1,
						// We use originalNewWidth in comment editor, because in comment editor
						// newWidth can be underined when table is resized to 'full-width'
						// scaleTable function needs number value to work correctly.
						parentWidth: isCommentEditor ? originalNewWidth : newWidth,
					},
					editorView.domAtPos.bind(editorView),
					pluginInjectionApi,
					isTableScalingEnabled,
					shouldUseIncreasedScalingPercent || false,
					isCommentEditor,
				)(tr);

				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const scaledNode = tr.doc.nodeAt(pos)!;

				attachAnalyticsEvent(
					generateResizedPayload({
						originalNode: node,
						resizedNode: scaledNode,
					}),
				)?.(tr);
			}
			displayGapCursor(true);
			dispatch(tr);

			if (delta.width < 0 && newWidth !== undefined) {
				pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify(
					formatMessage(messages.tableSizeDecreaseScreenReaderInformation, {
						newWidth: newWidth,
					}),
				);
			} else if (delta.width > 0 && newWidth !== undefined) {
				pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify(
					formatMessage(messages.tableSizeIncreaseScreenReaderInformation, {
						newWidth: newWidth,
					}),
				);
			}

			// Hide guidelines when resizing stops
			displayGuideline([]);
			newWidth !== undefined && updateWidth(newWidth);
			scheduleResize.cancel();

			if (onResizeStop) {
				onResizeStop();
			}

			return newWidth;
		},
		[
			editorView,
			getPos,
			node,
			isCommentEditor,
			widthToWidest,
			endMeasure,
			displayGapCursor,
			displayGuideline,
			updateWidth,
			scheduleResize,
			onResizeStop,
			attachAnalyticsEvent,
			tableRef,
			pluginInjectionApi,
			isTableScalingEnabled,
			shouldUseIncreasedScalingPercent,
			formatMessage,
		],
	);

	const handleTableSizeChangeOnKeypress = useCallback(
		(step: number) => {
			const newWidth = width + step;

			if (newWidth > maxWidth || newWidth < resizerMinWidth) {
				return;
			}
			handleResizeStop({ width: width, x: 0, y: 0, height: 0 }, { width: step, height: 0 });
		},
		[width, handleResizeStop, maxWidth, resizerMinWidth],
	);

	const handleEscape = useCallback((): void => {
		editorView?.focus();
	}, [editorView]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent): void => {
			const isBracketKey = event.code === 'BracketRight' || event.code === 'BracketLeft';

			const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

			if (event.altKey || metaKey || event.shiftKey) {
				areResizeMetaKeysPressed.current = true;
			}

			if (event.altKey && metaKey) {
				if (isBracketKey) {
					event.preventDefault();
					handleTableSizeChangeOnKeypress(
						event.code === 'BracketRight' ? RESIZE_STEP_VALUE : -RESIZE_STEP_VALUE,
					);
				}
			} else if (!areResizeMetaKeysPressed.current) {
				handleEscape();
			}
		},
		[handleEscape, handleTableSizeChangeOnKeypress],
	);

	const handleKeyUp = useCallback(
		(event: KeyboardEvent): void => {
			if (event.altKey || event.metaKey) {
				areResizeMetaKeysPressed.current = false;
			}
			return;
		},
		[areResizeMetaKeysPressed],
	);

	useLayoutEffect(() => {
		if (!resizerRef.current) {
			return;
		}
		const resizeHandleThumbEl = resizerRef.current.getResizerThumbEl();

		const globalKeyDownHandler = (event: KeyboardEvent): void => {
			const metaKey = browser.mac ? event.metaKey : event.ctrlKey;

			if (!isTableSelected) {
				return;
			}
			if (event.altKey && event.shiftKey && metaKey && event.code === 'KeyR') {
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
		};

		const editorViewDom = editorView?.dom as HTMLElement | undefined;
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		editorViewDom?.addEventListener('keydown', globalKeyDownHandler);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		resizeHandleThumbEl?.addEventListener('keydown', handleKeyDown);
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		resizeHandleThumbEl?.addEventListener('keyup', handleKeyUp);
		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			editorViewDom?.removeEventListener('keydown', globalKeyDownHandler);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			resizeHandleThumbEl?.removeEventListener('keydown', handleKeyDown);
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			resizeHandleThumbEl?.removeEventListener('keyup', handleKeyUp);
		};
	}, [resizerRef, editorView, handleResizeStop, isTableSelected, handleKeyDown, handleKeyUp]);

	useLayoutEffect(() => {
		updateTooltip.current?.();
	}, [width]);

	const resizeRatio =
		!isTableAlignmentEnabled ||
		(isTableAlignmentEnabled && normaliseAlignment(node.attrs.layout) === ALIGN_CENTER)
			? 2
			: 1;

	return (
		<>
			<ResizerNext
				ref={resizerRef}
				enable={
					fg('platform_editor_live_page_prevent_table_recreation')
						? disabled
							? {}
							: handles
						: handles
				}
				width={width}
				handleAlignmentMethod="sticky"
				handleSize={handleSize}
				handleStyles={handleStyles}
				handleResizeStart={handleResizeStart}
				handleResize={scheduleResize}
				handleResizeStop={handleResizeStop}
				resizeRatio={resizeRatio}
				minWidth={resizerMinWidth}
				maxWidth={maxWidth}
				snapGap={TABLE_SNAP_GAP}
				snap={guidelineSnaps}
				handlePositioning="adjacent"
				isHandleVisible={isTableSelected}
				needExtendedResizeZone={!isTableSelected}
				appearance={isTableSelected && isWholeTableInDanger ? 'danger' : undefined}
				handleHighlight="shadow"
				handleTooltipContent={({ update }) => {
					updateTooltip.current = update;
					return (
						<ToolTipContent
							description={formatMessage(messages.resizeTable)}
							keymap={focusTableResizer}
						/>
					);
				}}
			>
				{children}
			</ResizerNext>
		</>
	);
};
