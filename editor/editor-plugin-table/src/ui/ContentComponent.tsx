import React from 'react';

import {
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { getDomRefFromSelection } from '@atlaskit/editor-common/get-dom-ref-from-selection';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { ResizerBreakoutModeLabel } from '@atlaskit/editor-common/resizer';
import {
	type ExtractInjectionAPI,
	type GetEditorContainerWidth,
	type GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { expValNoExposure } from '@atlaskit/tmp-editor-statsig/expVal';

import type tablePlugin from '../tablePlugin';
import { type TablePlugin, type TablePluginOptions } from '../tablePluginType';
import { type TableSharedStateInternal } from '../types';

import FloatingContextualButton from './FloatingContextualButton';
import FloatingContextualMenu from './FloatingContextualMenu';
import FloatingDeleteButton from './FloatingDeleteButton';
import FloatingDragMenu from './FloatingDragMenu';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import FloatingInsertButton from './FloatingInsertButton';
import { FloatingToolbarLabel } from './FloatingToolbarLabel/FloatingToolbarLabel';
import { GlobalStylesWrapper } from './global-styles';
import { SizeSelector } from './SizeSelector';
import { FullWidthDisplay } from './TableFullWidthLabel';

export type ContentComponentProps = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	defaultGetEditorContainerWidth: GetEditorContainerWidth;
	defaultGetEditorFeatureFlags: GetEditorFeatureFlags;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	editorView?: EditorView;
	isTableSelectorEnabled: boolean | undefined;
	options?: TablePluginOptions;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<typeof tablePlugin>, ''> & {
		tableState: TableSharedStateInternal | undefined;
	},
) => ({
	resizingTableLocalId: states.tableState?.resizingTableLocalId,
	resizingTableRef: states.tableState?.resizingTableRef,
	isTableResizing: states.tableState?.isTableResizing,
	isResizing: states.tableState?.isResizing,
	widthToWidest: states.tableState?.widthToWidest,
	tableNode: states.tableState?.tableNode,
	targetCellPosition: states.tableState?.targetCellPosition,
	isContextualMenuOpen: states.tableState?.isContextualMenuOpen,
	tableRef: states.tableState?.tableRef,
	pluginConfig: states.tableState?.pluginConfig,
	insertColumnButtonIndex: states.tableState?.insertColumnButtonIndex,
	insertRowButtonIndex: states.tableState?.insertRowButtonIndex,
	isHeaderColumnEnabled: states.tableState?.isHeaderColumnEnabled,
	isHeaderRowEnabled: states.tableState?.isHeaderRowEnabled,
	isDragAndDropEnabled: states.tableState?.isDragAndDropEnabled,
	tableWrapperTarget: states.tableState?.tableWrapperTarget,
	isCellMenuOpenByKeyboard: states.tableState?.isCellMenuOpenByKeyboard,
	stickyHeader: states.tableState?.stickyHeader,
	dragMenuDirection: states.tableState?.dragMenuDirection,
	dragMenuIndex: states.tableState?.dragMenuIndex,
	isDragMenuOpen: states.tableState?.isDragMenuOpen,
	isSizeSelectorOpen: states.tableState?.isSizeSelectorOpen,
	sizeSelectorTargetRef: states.tableState?.sizeSelectorTargetRef,

	// IMPORTANT: hovered states are used by FloatingDragMenu component to render popup in the correct location
	hoveredRows: states.tableState?.hoveredRows,
	hoveredColumns: states.tableState?.hoveredColumns,
	hoveredCell: states.tableState?.hoveredCell,
});

const ContentComponentInternal = ({
	api,
	editorView,
	dispatchAnalyticsEvent,
	options,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isTableSelectorEnabled,
	defaultGetEditorContainerWidth,
	defaultGetEditorFeatureFlags,
}: ContentComponentProps) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const ariaNotifyPlugin = api?.accessibilityUtils?.actions.ariaNotify;

	const {
		resizingTableLocalId,
		resizingTableRef,
		isTableResizing,
		isResizing,
		widthToWidest,
		tableNode,
		targetCellPosition,
		isContextualMenuOpen,
		tableRef,
		pluginConfig,
		insertColumnButtonIndex,
		insertRowButtonIndex,
		isHeaderColumnEnabled,
		isHeaderRowEnabled,
		isDragAndDropEnabled,
		tableWrapperTarget,
		isCellMenuOpenByKeyboard,
		stickyHeader,
		dragMenuDirection,
		dragMenuIndex,
		isDragMenuOpen,
		isSizeSelectorOpen,
		sizeSelectorTargetRef,
	} = useSharedPluginStateWithSelector(api, ['table'], selector);

	const { allowControls } = pluginConfig ?? {};

	if (!editorView) {
		return null;
	}

	return (
		<>
			{targetCellPosition &&
				(tableRef || isCellMenuOpenByKeyboard) &&
				!isResizing &&
				options &&
				options.allowContextualMenu && (
					<FloatingContextualButton
						isNumberColumnEnabled={tableNode && tableNode.attrs.isNumberColumnEnabled}
						editorView={editorView}
						tableNode={tableNode}
						mountPoint={popupsMountPoint}
						targetCellPosition={targetCellPosition}
						scrollableElement={popupsScrollableElement}
						dispatchAnalyticsEvent={dispatchAnalyticsEvent}
						isContextualMenuOpen={isContextualMenuOpen}
						stickyHeader={stickyHeader}
						tableWrapper={tableWrapperTarget}
						isCellMenuOpenByKeyboard={isCellMenuOpenByKeyboard}
					/>
				)}
			{allowControls && (
				<FloatingInsertButton
					tableNode={tableNode}
					tableRef={tableRef}
					insertColumnButtonIndex={insertColumnButtonIndex}
					insertRowButtonIndex={insertRowButtonIndex}
					isHeaderColumnEnabled={isHeaderColumnEnabled}
					isHeaderRowEnabled={isHeaderRowEnabled}
					isDragAndDropEnabled={isDragAndDropEnabled}
					isTableScalingEnabled={options?.isTableScalingEnabled}
					editorView={editorView}
					mountPoint={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					hasStickyHeaders={stickyHeader && stickyHeader.sticky}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					editorAnalyticsAPI={editorAnalyticsAPI}
					getEditorContainerWidth={defaultGetEditorContainerWidth}
					getEditorFeatureFlags={options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags}
					isChromelessEditor={options?.isChromelessEditor}
					api={api}
					isCommentEditor={options?.isCommentEditor}
				/>
			)}
			{options?.allowContextualMenu && (
				<FloatingContextualMenu
					editorView={editorView}
					mountPoint={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					targetCellPosition={targetCellPosition}
					isOpen={Boolean(isContextualMenuOpen) && !isResizing}
					pluginConfig={pluginConfig}
					editorAnalyticsAPI={editorAnalyticsAPI}
					getEditorContainerWidth={defaultGetEditorContainerWidth}
					getEditorFeatureFlags={options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags}
					isCellMenuOpenByKeyboard={isCellMenuOpenByKeyboard}
					isCommentEditor={options?.isCommentEditor}
					api={api}
					isDragMenuOpen={
						isDragAndDropEnabled &&
						expValNoExposure('platform_editor_lovability_user_intent', 'isEnabled', true)
							? isDragMenuOpen
							: undefined
					}
				/>
			)}
			{isDragAndDropEnabled && (
				<FloatingDragMenu
					editorView={editorView}
					mountPoint={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					tableRef={tableRef as HTMLTableElement}
					tableNode={tableNode}
					targetCellPosition={targetCellPosition}
					direction={dragMenuDirection}
					index={dragMenuIndex}
					isOpen={!!isDragMenuOpen && !isResizing}
					getEditorContainerWidth={defaultGetEditorContainerWidth}
					editorAnalyticsAPI={editorAnalyticsAPI}
					stickyHeaders={stickyHeader}
					pluginConfig={pluginConfig}
					isTableScalingEnabled={options?.isTableScalingEnabled}
					getEditorFeatureFlags={options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags}
					ariaNotifyPlugin={ariaNotifyPlugin}
					api={api}
					isCommentEditor={options?.isCommentEditor}
				/>
			)}
			{allowControls && !isDragAndDropEnabled && !isResizing && (
				<FloatingDeleteButton
					editorView={editorView}
					selection={editorView.state.selection}
					tableRef={tableRef as HTMLTableElement}
					mountPoint={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					stickyHeaders={stickyHeader}
					isNumberColumnEnabled={tableNode && tableNode.attrs.isNumberColumnEnabled}
					editorAnalyticsAPI={editorAnalyticsAPI}
					api={api}
				/>
			)}
			{(options?.isTableScalingEnabled ||
				(options?.tableOptions.allowTableResizing && options.isCommentEditor)) &&
				isTableResizing &&
				widthToWidest &&
				resizingTableLocalId &&
				resizingTableRef &&
				widthToWidest[resizingTableLocalId] && (
					<FloatingToolbarLabel
						target={resizingTableRef}
						content={
							editorExperiment('single_column_layouts', true) ? (
								<ResizerBreakoutModeLabel layout="full-width" />
							) : (
								<FullWidthDisplay />
							)
						}
						alignX={'center'}
						alignY={'bottom'}
						stick={true}
						forcePlacement={true}
						zIndex={akEditorFloatingPanelZIndex}
						offset={[0, 10]}
					/>
				)}

			{isTableSelectorEnabled && isSizeSelectorOpen && (
				<SizeSelector
					api={api}
					isOpenedByKeyboard={false}
					popupsMountPoint={popupsMountPoint}
					target={
						sizeSelectorTargetRef ??
						getDomRefFromSelection(
							editorView,
							ACTION_SUBJECT_ID.PICKER_TABLE_SIZE,
							api?.analytics?.actions,
						)
					}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
				/>
			)}
		</>
	);
};

export const ContentComponent = ({
	api,
	editorView,
	dispatchAnalyticsEvent,
	options,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isTableSelectorEnabled,
	defaultGetEditorContainerWidth,
	defaultGetEditorFeatureFlags,
}: ContentComponentProps) => {
	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.TABLES_PLUGIN}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			fallbackComponent={null}
		>
			<GlobalStylesWrapper
				featureFlags={api?.featureFlags?.sharedState.currentState()}
				isDragAndDropEnabledOption={options?.dragAndDropEnabled}
				api={api}
			/>
			<ContentComponentInternal
				api={api}
				editorView={editorView}
				dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				options={options}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				isTableSelectorEnabled={isTableSelectorEnabled}
				defaultGetEditorContainerWidth={defaultGetEditorContainerWidth}
				defaultGetEditorFeatureFlags={defaultGetEditorFeatureFlags}
			/>
		</ErrorBoundary>
	);
};
