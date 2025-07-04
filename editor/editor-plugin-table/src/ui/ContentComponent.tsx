import React from 'react';

import {
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { getDomRefFromSelection } from '@atlaskit/editor-common/get-dom-ref-from-selection';
import { ResizerBreakoutModeLabel } from '@atlaskit/editor-common/resizer';
import {
	type ExtractInjectionAPI,
	type GetEditorContainerWidth,
	type GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type TablePlugin, type TablePluginOptions } from '../tablePluginType';

import FloatingContextualButton from './FloatingContextualButton';
import FloatingContextualMenu from './FloatingContextualMenu';
import FloatingDeleteButton from './FloatingDeleteButton';
import FloatingDragMenu from './FloatingDragMenu';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import FloatingInsertButton from './FloatingInsertButton';
import { FloatingToolbarLabel } from './FloatingToolbarLabel/FloatingToolbarLabel';
import { GlobalStylesWrapper } from './global-styles';
import { useInternalTablePluginStateSelector } from './hooks/useInternalTablePluginStateSelector';
import { SizeSelector } from './SizeSelector';
import { FullWidthDisplay } from './TableFullWidthLabel';

export type ContentComponentProps = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	editorView: EditorView;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	options?: TablePluginOptions;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	isTableSelectorEnabled: boolean | undefined;
	defaultGetEditorContainerWidth: GetEditorContainerWidth;
	defaultGetEditorFeatureFlags: GetEditorFeatureFlags;
};

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

	const resizingTableLocalId = useInternalTablePluginStateSelector(api, 'resizingTableLocalId');
	const resizingTableRef = useInternalTablePluginStateSelector(api, 'resizingTableRef');
	const isTableResizing = useInternalTablePluginStateSelector(api, 'isTableResizing');
	const isResizing = useInternalTablePluginStateSelector(api, 'isResizing');
	const widthToWidest = useInternalTablePluginStateSelector(api, 'widthToWidest');

	const tableNode = useInternalTablePluginStateSelector(api, 'tableNode');
	const targetCellPosition = useInternalTablePluginStateSelector(api, 'targetCellPosition');
	const isContextualMenuOpen = useInternalTablePluginStateSelector(api, 'isContextualMenuOpen');
	const tableRef = useInternalTablePluginStateSelector(api, 'tableRef');
	const pluginConfig = useInternalTablePluginStateSelector(api, 'pluginConfig');
	const insertColumnButtonIndex = useInternalTablePluginStateSelector(
		api,
		'insertColumnButtonIndex',
	);
	const insertRowButtonIndex = useInternalTablePluginStateSelector(api, 'insertRowButtonIndex');
	const isHeaderColumnEnabled = useInternalTablePluginStateSelector(api, 'isHeaderColumnEnabled');
	const isHeaderRowEnabled = useInternalTablePluginStateSelector(api, 'isHeaderRowEnabled');
	const isDragAndDropEnabled = useInternalTablePluginStateSelector(api, 'isDragAndDropEnabled');
	const tableWrapperTarget = useInternalTablePluginStateSelector(api, 'tableWrapperTarget');
	const isCellMenuOpenByKeyboard = useInternalTablePluginStateSelector(
		api,
		'isCellMenuOpenByKeyboard',
	);

	const { allowControls } = pluginConfig ?? {};

	const stickyHeader = useInternalTablePluginStateSelector(api, 'stickyHeader');

	const dragMenuDirection = useInternalTablePluginStateSelector(api, 'dragMenuDirection');
	const dragMenuIndex = useInternalTablePluginStateSelector(api, 'dragMenuIndex');
	const isDragMenuOpen = useInternalTablePluginStateSelector(api, 'isDragMenuOpen');

	const isSizeSelectorOpen = useInternalTablePluginStateSelector(api, 'isSizeSelectorOpen');
	const sizeSelectorTargetRef = useInternalTablePluginStateSelector(api, 'sizeSelectorTargetRef');

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
