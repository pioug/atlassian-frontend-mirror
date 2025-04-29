import React from 'react';

import { ACTION_SUBJECT, DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import {
	ExtractInjectionAPI,
	GetEditorContainerWidth,
	GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { TablePlugin, TablePluginOptions } from '../tablePluginType';

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
import { FullWidthDisplay } from './TableFullWidthLabel';

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

	const resizingTableLocalId = useInternalTablePluginStateSelector(api, 'resizingTableLocalId', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const resizingTableRef = useInternalTablePluginStateSelector(api, 'resizingTableRef', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isTableResizing = useInternalTablePluginStateSelector(api, 'isTableResizing', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isResizing = useInternalTablePluginStateSelector(api, 'isResizing', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const widthToWidest = useInternalTablePluginStateSelector(api, 'widthToWidest', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});

	const tableNode = useInternalTablePluginStateSelector(api, 'tableNode', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const targetCellPosition = useInternalTablePluginStateSelector(api, 'targetCellPosition', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isContextualMenuOpen = useInternalTablePluginStateSelector(api, 'isContextualMenuOpen', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const tableRef = useInternalTablePluginStateSelector(api, 'tableRef', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const pluginConfig = useInternalTablePluginStateSelector(api, 'pluginConfig', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const insertColumnButtonIndex = useInternalTablePluginStateSelector(
		api,
		'insertColumnButtonIndex',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const insertRowButtonIndex = useInternalTablePluginStateSelector(api, 'insertRowButtonIndex', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isHeaderColumnEnabled = useInternalTablePluginStateSelector(api, 'isHeaderColumnEnabled', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isHeaderRowEnabled = useInternalTablePluginStateSelector(api, 'isHeaderRowEnabled', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isDragAndDropEnabled = useInternalTablePluginStateSelector(api, 'isDragAndDropEnabled', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const tableWrapperTarget = useInternalTablePluginStateSelector(api, 'tableWrapperTarget', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isCellMenuOpenByKeyboard = useInternalTablePluginStateSelector(
		api,
		'isCellMenuOpenByKeyboard',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);

	const { allowControls } = pluginConfig ?? {};

	const stickyHeader = useInternalTablePluginStateSelector(api, 'stickyHeader', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});

	const dragMenuDirection = useInternalTablePluginStateSelector(api, 'dragMenuDirection', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const dragMenuIndex = useInternalTablePluginStateSelector(api, 'dragMenuIndex', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isDragMenuOpen = useInternalTablePluginStateSelector(api, 'isDragMenuOpen', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});

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
