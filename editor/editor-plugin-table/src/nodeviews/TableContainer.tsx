import type { PropsWithChildren } from 'react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import {
	CHANGE_ALIGNMENT_REASON,
	INPUT_METHOD,
	type TableEventPayload,
} from '@atlaskit/editor-common/analytics';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import type { EditorContainerWidth, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
	akEditorMobileBreakoutPoint,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { setTableAlignmentWithTableContentWithPosWithAnalytics } from '../pm-plugins/commands/commands-with-analytics';
import { getPluginState } from '../pm-plugins/plugin-factory';
import {
	TABLE_MAX_WIDTH,
	TABLE_FULL_WIDTH,
	TABLE_OFFSET_IN_COMMENT_EDITOR,
} from '../pm-plugins/table-resizing/utils/consts';
import {
	getTableResizerContainerMaxWidthInCSS,
	getTableResizerContainerForFullPageWidthInCSS,
} from '../pm-plugins/table-resizing/utils/misc';
import { ALIGN_CENTER, ALIGN_START } from '../pm-plugins/utils/alignment';
import type tablePlugin from '../tablePlugin';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';
import { TableCssClassName as ClassName } from '../types';

import { getAlignmentStyle } from './table-container-styles';
import { TableResizer } from './TableResizer';

type InnerContainerProps = {
	className: string;
	node: PMNode;
	style?: React.CSSProperties;
};

const InnerContainer = forwardRef<HTMLDivElement, PropsWithChildren<InnerContainerProps>>(
	({ className, style, node, children }, ref) => {
		return (
			<div
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				data-number-column={node.attrs.isNumberColumnEnabled}
				data-layout={node.attrs.layout}
				data-testid="table-container"
			>
				{children}
			</div>
		);
	},
);

type AlignmentTableContainerProps = {
	editorView?: EditorView;
	getPos?: () => number | undefined;
	node: PMNode;
	pluginInjectionApi?: PluginInjectionAPI;
};

const AlignmentTableContainer = ({
	node,
	children,
	pluginInjectionApi,
	getPos,
	editorView,
}: PropsWithChildren<AlignmentTableContainerProps>) => {
	const alignment = node.attrs.layout !== ALIGN_START ? ALIGN_CENTER : ALIGN_START;
	const { isFullWidthModeEnabled, wasFullWidthModeEnabled } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['table'],
		(states) => ({
			isFullWidthModeEnabled: states.tableState?.isFullWidthModeEnabled,
			wasFullWidthModeEnabled: states.tableState?.wasFullWidthModeEnabled,
		}),
	);

	useEffect(() => {
		if (editorView && getPos) {
			const { state, dispatch } = editorView;

			if (
				wasFullWidthModeEnabled &&
				isFullWidthModeEnabled !== undefined &&
				!isFullWidthModeEnabled &&
				alignment !== ALIGN_CENTER &&
				node.attrs.width > akEditorDefaultLayoutWidth
			) {
				const pos = getPos && getPos();

				if (typeof pos !== 'number') {
					return;
				}

				setTableAlignmentWithTableContentWithPosWithAnalytics(
					pluginInjectionApi?.analytics?.actions,
				)(
					ALIGN_CENTER,
					alignment,
					{ pos, node },
					INPUT_METHOD.AUTO,
					CHANGE_ALIGNMENT_REASON.EDITOR_APPEARANCE_CHANGED,
				)(state, dispatch);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorView, isFullWidthModeEnabled, wasFullWidthModeEnabled, node]);

	const style = useMemo(() => {
		return getAlignmentStyle(alignment);
	}, [alignment]);

	return (
		<div
			data-testid="table-alignment-container"
			data-ssr-placeholder={`table-${node.attrs.localId}`}
			data-ssr-placeholder-replace={`table-${node.attrs.localId}`}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
		>
			{children}
		</div>
	);
};

const AlignmentTableContainerWrapper = ({
	isTableAlignmentEnabled,
	node,
	children,
	pluginInjectionApi,
	getPos,
	editorView,
}: PropsWithChildren<AlignmentTableContainerProps & { isTableAlignmentEnabled?: boolean }>) => {
	if (!isTableAlignmentEnabled) {
		return (
			<div
				data-testid="table-alignment-container"
				data-ssr-placeholder={`table-${node.attrs.localId}`}
				data-ssr-placeholder-replace={`table-${node.attrs.localId}`}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					justifyContent: 'center',
				}}
			>
				{children}
			</div>
		);
	}

	return (
		<AlignmentTableContainer
			node={node}
			pluginInjectionApi={pluginInjectionApi}
			getPos={getPos}
			editorView={editorView}
		>
			{children}
		</AlignmentTableContainer>
	);
};

type ResizableTableContainerProps = {
	className: string;
	containerWidth: number;
	editorView: EditorView;
	getPos: () => number | undefined;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	isResizing?: boolean;
	isTableAlignmentEnabled?: boolean;
	isTableScalingEnabled?: boolean;
	isTableWithFixedColumnWidthsOptionEnabled?: boolean;
	isWholeTableInDanger?: boolean;

	lineLength: number;
	node: PMNode;
	pluginInjectionApi?: PluginInjectionAPI;
	shouldUseIncreasedScalingPercent?: boolean;
	tableRef: HTMLTableElement;
	tableWrapperHeight?: number;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<typeof tablePlugin>,
		'editorViewMode'
	> & {
		tableState: TableSharedStateInternal | undefined;
	},
) => ({
	tableState: states.tableState,
	editorViewModeState: states.editorViewModeState,
});

const getPadding = (containerWidth: number) => {
	return containerWidth <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
		? akEditorGutterPaddingReduced
		: akEditorGutterPaddingDynamic();
};

export const ResizableTableContainer = React.memo(
	({
		children,
		className,
		node,
		containerWidth,
		lineLength,
		editorView,
		getPos,
		tableRef,
		isResizing,
		pluginInjectionApi,
		tableWrapperHeight,
		isWholeTableInDanger,
		isTableScalingEnabled,
		isTableWithFixedColumnWidthsOptionEnabled,
		isTableAlignmentEnabled,
		shouldUseIncreasedScalingPercent,
		isCommentEditor,
		isChromelessEditor,
	}: PropsWithChildren<ResizableTableContainerProps>) => {
		const tableWidth = getTableContainerWidth(node);
		const containerRef = useRef<HTMLDivElement | null>(null);
		const tableWidthRef = useRef<number>(akEditorDefaultLayoutWidth);
		const [resizing, setIsResizing] = useState(false);

		const { tableState, editorViewModeState } = useSharedPluginStateWithSelector(
			pluginInjectionApi,
			['table', 'editorViewMode'],
			selector,
		);
		const isFullWidthModeEnabled = tableState?.isFullWidthModeEnabled;
		const mode = editorViewModeState?.mode;

		const updateContainerHeight = useCallback((height: number | 'auto') => {
			// current StickyHeader State is not stable to be fetch.
			// we need to update stickyHeader plugin to make sure state can be
			//    consistently fetch and refactor below
			const stickyHeaders = containerRef.current?.getElementsByClassName('pm-table-sticky');
			if (!stickyHeaders || stickyHeaders.length < 1) {
				// when starting to drag, we need to keep the original space,
				// -- When sticky header not appear, margin top(24px) and margin bottom(16px), should be 40px,
				//    1px is border width but collapse make it 0.5.
				// -- When sticky header appear, we should add first row height but reduce
				//    collapsed border
				return typeof height === 'number' ? `${height + 40.5}px` : 'auto';
			} else {
				const stickyHeaderHeight =
					containerRef.current?.getElementsByTagName('th')[0].getBoundingClientRect().height || 0;

				return typeof height === 'number' ? `${height + stickyHeaderHeight + 39.5}px` : 'auto';
			}
		}, []);

		const onResizeStart = useCallback(() => {
			setIsResizing(true);
		}, []);

		const onResizeStop = useCallback(() => {
			setIsResizing(false);
		}, []);

		const updateWidth = useCallback((width?: number) => {
			if (!containerRef.current) {
				return;
			}

			// make sure during resizing
			// the pm-table-resizer-container width is the same as its child div resizer-item
			// otherwise when resize table from wider to narrower , pm-table-resizer-container stays wider
			// and cause the fabric-editor-popup-scroll-parent to overflow
			if (containerRef.current.style.width !== `${width}px`) {
				containerRef.current.style.width = `${width}px`;
			}
		}, []);

		const displayGuideline = useCallback(
			(guidelines: GuidelineConfig[]) => {
				return (
					pluginInjectionApi?.guideline?.actions?.displayGuideline(editorView)({
						guidelines,
					}) ?? false
				);
			},
			[pluginInjectionApi, editorView],
		);

		const attachAnalyticsEvent = useCallback(
			(payload: TableEventPayload) => {
				return pluginInjectionApi?.analytics?.actions.attachAnalyticsEvent(payload);
			},
			[pluginInjectionApi],
		);

		const displayGapCursor = useCallback(
			(toggle: boolean) => {
				return (
					pluginInjectionApi?.core?.actions.execute(
						pluginInjectionApi?.selection?.commands.displayGapCursor(toggle),
					) ?? false
				);
			},
			[pluginInjectionApi],
		);

		const isFullPageAppearance = !isCommentEditor && !isChromelessEditor;

		const { width, maxResizerWidth } = useMemo(() => {
			let responsiveContainerWidth = 0;
			const resizeHandleSpacing = 12;
			const padding = getPadding(containerWidth);
			// When Full width editor enabled, a Mac OS user can change "ak-editor-content-area" width by
			// updating Settings -> Appearance -> Show scroll bars from "When scrolling" to "Always". It causes
			// issues when viwport width is less than full width Editor's width. To detect avoid them
			// we need to use lineLength to defined responsiveWidth instead of containerWidth
			// (which does not get updated when Mac setting changes) in Full-width editor.
			if (isFullWidthModeEnabled) {
				// When: Show scroll bars -> containerWidth = akEditorGutterPadding * 2 + lineLength;
				// When: Always -> containerWidth = akEditorGutterPadding * 2 + lineLength + scrollbarWidth;
				// scrollbarWidth can vary. Values can be 14, 15, 16 and up to 20px;
				responsiveContainerWidth = isTableScalingEnabled
					? lineLength
					: containerWidth - padding * 2 - resizeHandleSpacing;

				// platform_editor_table_fw_numcol_overflow_fix:
				// lineLength is undefined on first paint → width: NaN → wrapper expands to page
				// width. rAF col-sizing then runs before the number-column padding and
				// the final shrink, so column widths are locked in wrong.
				// With the flag ON, if the value isn’t finite we fall back to gutterWidth
				// for that first frame—no flash, no premature rAF.
				//
				// Type clean-up comes later:
				// 1) ship this runtime guard (quick fix, no breakage);
				// 2) TODO: widen lineLength to `number|undefined` and remove this block.
				if (fg('platform_editor_table_fw_numcol_overflow_fix')) {
					if (isTableScalingEnabled && !Number.isFinite(responsiveContainerWidth)) {
						responsiveContainerWidth = containerWidth - padding * 2 - resizeHandleSpacing;
					}
				}
			} else if (isCommentEditor) {
				responsiveContainerWidth = containerWidth - TABLE_OFFSET_IN_COMMENT_EDITOR;
			} else {
				// 76 is currently an accepted padding value considering the spacing for resizer handle
				// containerWidth = width of a DIV with test id="ak-editor-fp-content-area". It is a parent of
				// a DIV with className="ak-editor-content-area". This DIV has padding left and padding right.
				// padding left = padding right = akEditorGutterPadding = 32
				responsiveContainerWidth = isTableScalingEnabled
					? containerWidth - padding * 2
					: containerWidth - padding * 2 - resizeHandleSpacing;
			}

			// Fix for HOT-119925: Ensure table width is properly constrained and responsive
			// For wide tables, ensure they don't exceed container width and can be scrolled
			const calculatedWidth =
				!node.attrs.width && isCommentEditor
					? responsiveContainerWidth
					: Math.min(tableWidth, responsiveContainerWidth);

			// Ensure minimum width for usability while respecting container constraints
			const width = Math.max(calculatedWidth, Math.min(responsiveContainerWidth * 0.5, 300));

			const maxResizerWidth = isCommentEditor
				? responsiveContainerWidth
				: Math.min(
						responsiveContainerWidth,
						expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true)
							? TABLE_MAX_WIDTH
							: TABLE_FULL_WIDTH,
					);
			return { width, maxResizerWidth };
		}, [
			containerWidth,
			isCommentEditor,
			isFullWidthModeEnabled,
			isTableScalingEnabled,
			lineLength,
			node.attrs.width,
			tableWidth,
		]);

		useEffect(() => {
			if (!isResizing) {
				tableWidthRef.current = width;
			}
		}, [width, isResizing]);

		// CSS Solution for table resizer container width
		const tableResizerContainerWidth = useMemo(() => {
			return getTableResizerContainerForFullPageWidthInCSS(node, isTableScalingEnabled);
		}, [node, isTableScalingEnabled]);

		// CSS Solution for table resizer max width
		const tableResizerMaxWidth = React.useMemo(() => {
			const isFullPageAppearance = !isCommentEditor && !isChromelessEditor;
			const nonResizingMaxWidth = isFullPageAppearance
				? getTableResizerContainerMaxWidthInCSS(
						isCommentEditor,
						isChromelessEditor,
						isTableScalingEnabled,
					)
				: maxResizerWidth;
			// isResizing is needed, otherwise we can't resize table.
			// when not resizing, maxWidth is calculated based on the container width via CSS
			return !isResizing ? nonResizingMaxWidth : maxResizerWidth;
		}, [isCommentEditor, isChromelessEditor, isTableScalingEnabled, isResizing, maxResizerWidth]);

		const tableResizerProps = {
			// The `width` is used for .resizer-item in <TableResizer>, and it has to be a number
			// So we can't use min(var(--ak-editor-table-width), ${tableWidth}px) here
			// We still have to use JS to calculate width
			width,
			maxWidth: tableResizerMaxWidth,
			containerWidth,
			lineLength,
			updateWidth,
			editorView,
			getPos,
			node,
			tableRef,
			displayGuideline,
			attachAnalyticsEvent,
			displayGapCursor,
			isTableAlignmentEnabled,
			isFullWidthModeEnabled,
			isTableScalingEnabled,
			isTableWithFixedColumnWidthsOptionEnabled,
			isWholeTableInDanger,
			shouldUseIncreasedScalingPercent,
			pluginInjectionApi,
			onResizeStart,
			onResizeStop,
			isCommentEditor,
		};

		const isLivePageViewMode = mode === 'view';

		return (
			<AlignmentTableContainerWrapper
				isTableAlignmentEnabled={isTableAlignmentEnabled}
				node={node}
				pluginInjectionApi={pluginInjectionApi}
				getPos={getPos}
				editorView={editorView}
			>
				<div
					style={
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							'--ak-editor-table-gutter-padding':
								'calc(var(--ak-editor--large-gutter-padding) * 2)',
							'--ak-editor-table-width': isFullPageAppearance
								? tableResizerContainerWidth
								: `${tableWidthRef.current}px`,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							width: 'var(--ak-editor-table-width)',
							height: resizing ? updateContainerHeight(tableWrapperHeight ?? 'auto') : 'auto',
							position: isLivePageViewMode ? 'relative' : 'unset',
						} as React.CSSProperties
					}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={ClassName.TABLE_RESIZER_CONTAINER}
					ref={containerRef}
				>
					{/* eslint-disable-next-line react/jsx-props-no-spreading -- Ignored via go/ees005 */}
					<TableResizer {...tableResizerProps} disabled={isLivePageViewMode}>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<InnerContainer className={className} node={node}>
							{children}
						</InnerContainer>
					</TableResizer>
				</div>
			</AlignmentTableContainerWrapper>
		);
	},
);

type TableContainerProps = {
	className: string;
	containerWidth: EditorContainerWidth;
	editorView: EditorView;
	getPos: () => number | undefined;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	isNested: boolean;
	isResizing?: boolean;
	isTableAlignmentEnabled?: boolean;
	isTableResizingEnabled: boolean | undefined;
	isTableScalingEnabled?: boolean;
	isTableWithFixedColumnWidthsOptionEnabled?: boolean;

	isWholeTableInDanger?: boolean;
	node: PMNode;
	pluginInjectionApi?: PluginInjectionAPI;
	shouldUseIncreasedScalingPercent?: boolean;
	tableRef: HTMLTableElement;
	tableWrapperHeight?: number;
};

export const TableContainer = ({
	children,
	node,
	className,
	containerWidth: { width: editorWidth, lineLength },
	editorView,
	getPos,
	tableRef,
	isNested,
	tableWrapperHeight,
	isResizing,
	pluginInjectionApi,
	isWholeTableInDanger,
	isTableResizingEnabled,
	isTableScalingEnabled,
	isTableWithFixedColumnWidthsOptionEnabled,
	isTableAlignmentEnabled,
	shouldUseIncreasedScalingPercent,
	isCommentEditor,
	isChromelessEditor,
}: PropsWithChildren<TableContainerProps>) => {
	if (isTableResizingEnabled && !isNested) {
		return (
			<ResizableTableContainer
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				node={node}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				containerWidth={editorWidth!}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				lineLength={lineLength!}
				editorView={editorView}
				getPos={getPos}
				tableRef={tableRef}
				tableWrapperHeight={tableWrapperHeight}
				isResizing={isResizing}
				pluginInjectionApi={pluginInjectionApi}
				isTableScalingEnabled={isTableScalingEnabled}
				isTableWithFixedColumnWidthsOptionEnabled={isTableWithFixedColumnWidthsOptionEnabled}
				isWholeTableInDanger={isWholeTableInDanger}
				isTableAlignmentEnabled={isTableAlignmentEnabled}
				shouldUseIncreasedScalingPercent={shouldUseIncreasedScalingPercent}
				isCommentEditor={isCommentEditor}
				isChromelessEditor={isChromelessEditor}
			>
				{children}
			</ResizableTableContainer>
		);
	}

	const { isDragAndDropEnabled } = getPluginState(editorView.state);
	const isFullPageAppearance = !isCommentEditor && !isChromelessEditor;

	const resizableTableWidth = isFullPageAppearance
		? getTableResizerContainerForFullPageWidthInCSS(node, isTableScalingEnabled)
		: `calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2))`;
	return (
		<InnerContainer
			node={node}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={classNames(className, {
				'less-padding':
					editorWidth < akEditorMobileBreakoutPoint &&
					!isNested &&
					!(isChromelessEditor && isDragAndDropEnabled),
			})}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: 'inherit',
					marginLeft: isChromelessEditor ? 18 : undefined,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					'--ak-editor-table-width': resizableTableWidth,
				} as React.CSSProperties
			}
		>
			{children}
		</InnerContainer>
	);
};
