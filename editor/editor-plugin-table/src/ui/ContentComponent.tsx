import React from 'react';

import { ACTION_SUBJECT, DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import {
	ExtractInjectionAPI,
	GetEditorContainerWidth,
	GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';

import { TablePlugin, TablePluginOptions } from '../tablePluginType';
import { TableSharedStateInternal } from '../types';

import FloatingContextualButton from './FloatingContextualButton';
import FloatingContextualMenu from './FloatingContextualMenu';
import FloatingDeleteButton from './FloatingDeleteButton';
import FloatingDragMenu from './FloatingDragMenu';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import FloatingInsertButton from './FloatingInsertButton';
import { FloatingToolbarLabel } from './FloatingToolbarLabel/FloatingToolbarLabel';
import { GlobalStylesWrapper } from './global-styles';
import { FullWidthDisplay } from './TableFullWidthLabel';

const useSharedTablePluginStateSelector = <K extends keyof TableSharedStateInternal>(
	api: ExtractInjectionAPI<TablePlugin> | undefined,
	key: K,
) => {
	const value = useSharedPluginStateSelector(
		api,
		`table.${key}` as never,
	) as TableSharedStateInternal[K];
	return value;
};

export type ContentComponentProps = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	editorView: EditorView;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
	options?: TablePluginOptions;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
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
	defaultGetEditorContainerWidth,
	defaultGetEditorFeatureFlags,
}: ContentComponentProps) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const ariaNotifyPlugin = api?.accessibilityUtils?.actions.ariaNotify;

	const resizingTableLocalId = useSharedTablePluginStateSelector(api, 'resizingTableLocalId');
	const resizingTableRef = useSharedTablePluginStateSelector(api, 'resizingTableRef');
	const isTableResizing = useSharedTablePluginStateSelector(api, 'isTableResizing');
	const isResizing = useSharedTablePluginStateSelector(api, 'isResizing');
	const widthToWidest = useSharedTablePluginStateSelector(api, 'widthToWidest');

	const tableNode = useSharedTablePluginStateSelector(api, 'tableNode');
	const targetCellPosition = useSharedTablePluginStateSelector(api, 'targetCellPosition');
	const isContextualMenuOpen = useSharedTablePluginStateSelector(api, 'isContextualMenuOpen');
	const tableRef = useSharedTablePluginStateSelector(api, 'tableRef');
	const pluginConfig = useSharedTablePluginStateSelector(api, 'pluginConfig');
	const insertColumnButtonIndex = useSharedTablePluginStateSelector(api, 'insertColumnButtonIndex');
	const insertRowButtonIndex = useSharedTablePluginStateSelector(api, 'insertRowButtonIndex');
	const isHeaderColumnEnabled = useSharedTablePluginStateSelector(api, 'isHeaderColumnEnabled');
	const isHeaderRowEnabled = useSharedTablePluginStateSelector(api, 'isHeaderRowEnabled');
	const isDragAndDropEnabled = useSharedTablePluginStateSelector(api, 'isDragAndDropEnabled');
	const tableWrapperTarget = useSharedTablePluginStateSelector(api, 'tableWrapperTarget');
	const isCellMenuOpenByKeyboard = useSharedTablePluginStateSelector(
		api,
		'isCellMenuOpenByKeyboard',
	);

	const { allowControls } = pluginConfig;

	const stickyHeader = useSharedTablePluginStateSelector(api, 'stickyHeader');

	const dragMenuDirection = useSharedTablePluginStateSelector(api, 'dragMenuDirection');
	const dragMenuIndex = useSharedTablePluginStateSelector(api, 'dragMenuIndex');
	const isDragMenuOpen = useSharedTablePluginStateSelector(api, 'isDragMenuOpen');

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
						content={<FullWidthDisplay />}
						alignX={'center'}
						alignY={'bottom'}
						stick={true}
						forcePlacement={true}
						zIndex={akEditorFloatingPanelZIndex}
						offset={[0, 10]}
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
				defaultGetEditorContainerWidth={defaultGetEditorContainerWidth}
				defaultGetEditorFeatureFlags={defaultGetEditorFeatureFlags}
			/>
		</ErrorBoundary>
	);
};
