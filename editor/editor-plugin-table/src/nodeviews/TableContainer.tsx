import type { PropsWithChildren } from 'react';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import {
	CHANGE_ALIGNMENT_REASON,
	INPUT_METHOD,
	type TableEventPayload,
} from '@atlaskit/editor-common/analytics';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import type { EditorContainerWidth } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorMobileBreakoutPoint,
} from '@atlaskit/editor-shared-styles';

import { setTableAlignmentWithTableContentWithPosWithAnalytics } from '../commands-with-analytics';
import {
	TABLE_MAX_WIDTH,
	TABLE_OFFSET_IN_COMMENT_EDITOR,
} from '../pm-plugins/table-resizing/utils';
import type { PluginInjectionAPI, TableSharedState } from '../types';
import { TableCssClassName as ClassName } from '../types';
import { ALIGN_CENTER, ALIGN_START } from '../utils/alignment';

import { TableResizer } from './TableResizer';

type InnerContainerProps = {
	className: string;
	style?: {
		width: number | 'inherit';
		marginLeft?: number;
	};
	node: PMNode;
};

export const InnerContainer = forwardRef<HTMLDivElement, PropsWithChildren<InnerContainerProps>>(
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

const centerAlignStyle = { display: 'flex', justifyContent: 'center' };

const leftAlignStyle = { display: 'flex', justifyContent: 'flex-start' };

type AlignmentTableContainerProps = {
	node: PMNode;
	pluginInjectionApi?: PluginInjectionAPI;
	getPos?: () => number | undefined;
	editorView?: EditorView;
};

const AlignmentTableContainer = ({
	node,
	children,
	pluginInjectionApi,
	getPos,
	editorView,
}: PropsWithChildren<AlignmentTableContainerProps>) => {
	const alignment = node.attrs.layout !== ALIGN_START ? ALIGN_CENTER : ALIGN_START;
	const { tableState } = useSharedPluginState(pluginInjectionApi, ['table']);

	useEffect(() => {
		if (tableState && editorView && getPos) {
			const { wasFullWidthModeEnabled, isFullWidthModeEnabled } = tableState;
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
	}, [editorView, tableState, node]);

	const style = useMemo(() => {
		return alignment === 'align-start' ? leftAlignStyle : centerAlignStyle;
	}, [alignment]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div data-testid="table-alignment-container" style={style}>
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
	containerWidth: number;
	lineLength: number;
	node: PMNode;
	className: string;
	editorView: EditorView;
	getPos: () => number | undefined;
	tableRef: HTMLTableElement;
	isResizing?: boolean;
	pluginInjectionApi?: PluginInjectionAPI;
	tableWrapperHeight?: number;
	isWholeTableInDanger?: boolean;

	isTableScalingEnabled?: boolean;
	isTableWithFixedColumnWidthsOptionEnabled?: boolean;
	isTableAlignmentEnabled?: boolean;
	shouldUseIncreasedScalingPercent?: boolean;
	isCommentEditor?: boolean;
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
	}: PropsWithChildren<ResizableTableContainerProps>) => {
		const containerRef = useRef<HTMLDivElement | null>(null);
		const tableWidthRef = useRef<number>(akEditorDefaultLayoutWidth);
		const [resizing, setIsResizing] = useState(false);
		const { tableState } = useSharedPluginState(pluginInjectionApi, ['table']);
		const { isFullWidthModeEnabled } = tableState as TableSharedState;

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

		const updateWidth = useCallback((width: number) => {
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

		const tableWidth = getTableContainerWidth(node);
		const { editorViewModeState } = useSharedPluginState(pluginInjectionApi, ['editorViewMode']);

		let responsiveContainerWidth = 0;
		const resizeHandleSpacing = 12;
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
				: containerWidth - akEditorGutterPaddingDynamic() * 2 - resizeHandleSpacing;
		} else if (isCommentEditor) {
			responsiveContainerWidth = containerWidth - TABLE_OFFSET_IN_COMMENT_EDITOR;
		} else {
			// 76 is currently an accepted padding value considering the spacing for resizer handle
			// containerWidth = width of a DIV with test id="ak-editor-fp-content-area". It is a parent of
			// a DIV with className="ak-editor-content-area". This DIV has padding left and padding right.
			// padding left = padding right = akEditorGutterPadding = 32
			responsiveContainerWidth = isTableScalingEnabled
				? containerWidth - akEditorGutterPaddingDynamic() * 2
				: containerWidth - akEditorGutterPaddingDynamic() * 2 - resizeHandleSpacing;
		}
		let width =
			!node.attrs.width && isCommentEditor
				? responsiveContainerWidth
				: Math.min(tableWidth, responsiveContainerWidth);

		if (!isResizing) {
			tableWidthRef.current = width;
		}
		const maxResizerWidth = isCommentEditor
			? responsiveContainerWidth
			: Math.min(responsiveContainerWidth, TABLE_MAX_WIDTH);

		const tableResizerProps = {
			width,
			maxWidth: maxResizerWidth,
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

		const isLivePageViewMode = editorViewModeState?.mode === 'view';

		return (
			<AlignmentTableContainerWrapper
				isTableAlignmentEnabled={isTableAlignmentEnabled}
				node={node}
				pluginInjectionApi={pluginInjectionApi}
				getPos={getPos}
				editorView={editorView}
			>
				<div
					style={{
						width: tableWidthRef.current,
						height: resizing ? updateContainerHeight(tableWrapperHeight ?? 'auto') : 'auto',
						position: isLivePageViewMode ? 'relative' : 'unset',
					}}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={ClassName.TABLE_RESIZER_CONTAINER}
					ref={containerRef}
				>
					{isLivePageViewMode ? (
						<InnerContainer
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={className}
							node={node}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={{ width: 'inherit' }}
						>
							{children}
						</InnerContainer>
					) : (
						<TableResizer {...tableResizerProps}>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
							<InnerContainer className={className} node={node}>
								{children}
							</InnerContainer>
						</TableResizer>
					)}
				</div>
			</AlignmentTableContainerWrapper>
		);
	},
);

type TableContainerProps = {
	node: PMNode;
	className: string;
	containerWidth: EditorContainerWidth;
	editorView: EditorView;
	getPos: () => number | undefined;
	tableRef: HTMLTableElement;
	isNested: boolean;
	isResizing?: boolean;
	pluginInjectionApi?: PluginInjectionAPI;
	tableWrapperHeight?: number;
	isWholeTableInDanger?: boolean;

	isTableResizingEnabled: boolean | undefined;
	isTableScalingEnabled?: boolean;
	isTableWithFixedColumnWidthsOptionEnabled?: boolean;
	isTableAlignmentEnabled?: boolean;
	shouldUseIncreasedScalingPercent?: boolean;
	isCommentEditor?: boolean;
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
}: PropsWithChildren<TableContainerProps>) => {
	if (isTableResizingEnabled && !isNested) {
		return (
			<ResizableTableContainer
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				node={node}
				containerWidth={editorWidth!}
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
			>
				{children}
			</ResizableTableContainer>
		);
	}

	return (
		<InnerContainer
			node={node}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={classNames(className, {
				'less-padding': editorWidth < akEditorMobileBreakoutPoint && !isNested,
			})}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: 'inherit',
			}}
		>
			{children}
		</InnerContainer>
	);
};
