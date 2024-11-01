import React from 'react';

import {
	tableCell,
	tableCellWithNestedTable,
	tableHeader,
	tableHeaderWithNestedTable,
	tableRow,
	tableRowWithNestedTable,
} from '@atlaskit/adf-schema';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import { browser } from '@atlaskit/editor-common/browser';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { IconTable } from '@atlaskit/editor-common/icons';
import { toggleTable, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Command,
	EditorCommand,
	EditorPlugin,
	GetEditorContainerWidth,
	GetEditorFeatureFlags,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BatchAttributeUpdatesPlugin } from '@atlaskit/editor-plugin-batch-attribute-updates';
import type { ContentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
import { tableEditing } from '@atlaskit/editor-tables/pm-plugins';
import { fg } from '@atlaskit/platform-feature-flags';

import { insertTableWithSize } from './commands/insert';
import { pluginConfig } from './create-plugin-config';
import { createPlugin as createTableAnalyticsPlugin } from './pm-plugins/analytics/plugin';
import { pluginKey as tableAnalyticsPluginKey } from './pm-plugins/analytics/plugin-key';
import { createPlugin as createDecorationsPlugin } from './pm-plugins/decorations/plugin';
import {
	createPlugin as createDragAndDropPlugin,
	pluginKey as dragAndDropPluginKey,
} from './pm-plugins/drag-and-drop';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { getPluginState } from './pm-plugins/plugin-factory';
import { pluginKey } from './pm-plugins/plugin-key';
import { createPlugin as createTableSafariDeleteCompositionTextIssueWorkaroundPlugin } from './pm-plugins/safari-delete-composition-text-issue-workaround';
import {
	createPlugin as createStickyHeadersPlugin,
	findStickyHeaderForTable,
	pluginKey as stickyHeadersPluginKey,
} from './pm-plugins/sticky-headers';
import { createPlugin as createTableOverflowAnalyticsPlugin } from './pm-plugins/table-analytics';
import { createPlugin as createTableLocalIdPlugin } from './pm-plugins/table-local-id';
import {
	createPlugin as createFlexiResizingPlugin,
	getPluginState as getFlexiResizingPlugin,
	pluginKey as tableResizingPluginKey,
} from './pm-plugins/table-resizing';
import { tableSelectionKeymapPlugin } from './pm-plugins/table-selection-keymap';
import {
	createPlugin as createTableWidthPlugin,
	pluginKey as tableWidthPluginKey,
} from './pm-plugins/table-width';
import { createPlugin as createTableWidthInCommentFixPlugin } from './pm-plugins/table-width-in-comment-fix';
import { createPlugin as createViewModeSortPlugin } from './pm-plugins/view-mode-sort';
import { tableNodeSpecWithFixedToDOM } from './toDOM';
import { getToolbarConfig } from './toolbar';
import type { ColumnResizingPluginState, PluginConfig, TableSharedState } from './types';
import FloatingContextualButton from './ui/FloatingContextualButton';
import FloatingContextualMenu from './ui/FloatingContextualMenu';
import FloatingDeleteButton from './ui/FloatingDeleteButton';
import FloatingDragMenu from './ui/FloatingDragMenu';
import FloatingInsertButton from './ui/FloatingInsertButton';
import { FloatingToolbarLabel } from './ui/FloatingToolbarLabel/FloatingToolbarLabel';
import { GlobalStylesWrapper } from './ui/global-styles';
import { FullWidthDisplay } from './ui/TableFullWidthLabel';
import { createTableWithWidth } from './utils';

export interface TablePluginOptions {
	tableOptions: PluginConfig;
	tableResizingEnabled?: boolean;
	dragAndDropEnabled?: boolean;
	allowContextualMenu?: boolean;
	// TODO these two need to be rethought
	fullWidthEnabled?: boolean;
	wasFullWidthEnabled?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isTableScalingEnabled?: boolean;
	isTableAlignmentEnabled?: boolean;
	isNewColumnResizingEnabled?: boolean;
	isCommentEditor?: boolean;
	isChromelessEditor?: boolean;
}

type InsertTableAction = (analyticsPayload: AnalyticsEventPayload) => Command;

const defaultGetEditorFeatureFlags = () => ({});

// TODO: duplicating type instead of importing media plugin causing a circular dependency
type MediaPlugin = NextEditorPlugin<
	'media',
	{
		pluginConfiguration: any;
		dependencies: any;
		sharedState: any;
		actions: any;
		commands: any;
	}
>;

export type TablePlugin = NextEditorPlugin<
	'table',
	{
		pluginConfiguration: TablePluginOptions | undefined;
		actions: {
			insertTable: InsertTableAction;
		};
		sharedState?: TableSharedState;
		commands: {
			insertTableWithSize: (
				rowsCount: number,
				colsCount: number,
				inputMethod?: INPUT_METHOD.PICKER,
			) => EditorCommand;
		};
		dependencies: [
			AnalyticsPlugin,
			ContentInsertionPlugin,
			WidthPlugin,
			GuidelinePlugin,
			SelectionPlugin,
			OptionalPlugin<BatchAttributeUpdatesPlugin>,
			OptionalPlugin<AccessibilityUtilsPlugin>,
			OptionalPlugin<MediaPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
		];
	}
>;

/**
 * Table plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
const tablesPlugin: TablePlugin = ({ config: options, api }) => {
	const editorViewRef: Record<'current', EditorView | null> = { current: null };
	const defaultGetEditorContainerWidth: GetEditorContainerWidth = () => {
		return (
			api?.width?.sharedState.currentState() ?? {
				width: document?.body?.offsetWidth ?? 500,
			}
		);
	};
	const editorAnalyticsAPI = api?.analytics?.actions;
	const ariaNotifyPlugin = api?.accessibilityUtils?.actions.ariaNotify;

	const isTableFixedColumnWidthsOptionEnabled =
		options?.getEditorFeatureFlags?.().tableWithFixedColumnWidthsOption || false;

	const shouldUseIncreasedScalingPercent =
		options?.isTableScalingEnabled &&
		(isTableFixedColumnWidthsOptionEnabled ||
			// When in comment editor, we need the scaling percent to be 40% while tableWithFixedColumnWidthsOption is not visible
			options?.isCommentEditor);

	const isCellBackgroundDuplicated =
		options?.getEditorFeatureFlags?.().tableDuplicateCellColouring || false;

	return {
		name: 'table',

		// Use getSharedState to store fullWidthEnabled and wasFullWidthModeEnabled to guarantee access
		// to most up to date values - passing to createPluginState will not re-initialise the state
		getSharedState: (editorState) => {
			if (!editorState) {
				return undefined;
			}

			const tablePluginState = getPluginState(editorState);
			const tableResizingPluginState = getFlexiResizingPlugin(editorState);
			const tableWidthResizingPluginState = tableWidthPluginKey.getState(editorState);

			return {
				isFullWidthModeEnabled: !!options?.fullWidthEnabled,
				wasFullWidthModeEnabled: !!options?.wasFullWidthEnabled,
				isHeaderRowEnabled: tablePluginState.isHeaderRowEnabled,
				isHeaderColumnEnabled: tablePluginState.isHeaderColumnEnabled,
				ordering: tablePluginState.ordering,
				isResizing: !!(
					tableResizingPluginState?.dragging || tableWidthResizingPluginState?.resizing
				),
				isTableResizing: tableWidthResizingPluginState?.resizing,
				isInDanger: tablePluginState.isInDanger,
				hoveredRows: tablePluginState.hoveredRows,
				hoveredCell: tablePluginState.hoveredCell,
				isTableHovered: tablePluginState.isTableHovered,
				isWholeTableInDanger: tablePluginState.isWholeTableInDanger,
				// IMPORTANT: Need to continue to pass tableNode to control re-renders
				// TableComponent listens for node attribute changes to update colgroups
				tableNode: tablePluginState.tableNode,
				widthToWidest: tablePluginState.widthToWidest,
			};
		},

		actions: {
			insertTable:
				(analyticsPayload): Command =>
				(state, dispatch) => {
					const node = createTableWithWidth({
						isTableScalingEnabled: options?.isTableScalingEnabled,
						isTableAlignmentEnabled: options?.isTableAlignmentEnabled,
						isFullWidthModeEnabled: options?.fullWidthEnabled,
						isCommentEditor: options?.isCommentEditor,
						isChromelessEditor: options?.isChromelessEditor,
						isTableResizingEnabled: options?.tableResizingEnabled,
					})(state.schema);

					return (
						api?.contentInsertion?.actions?.insert({
							state,
							dispatch,
							node,

							options: {
								selectNodeInserted: false,
								analyticsPayload: {
									...analyticsPayload,
									attributes: {
										...analyticsPayload.attributes,
										localId: node.attrs.localId,
									},
								},
							},
						}) ?? false
					);
				},
		},

		commands: {
			insertTableWithSize: insertTableWithSize(
				options?.fullWidthEnabled,
				options?.isTableScalingEnabled,
				options?.isTableAlignmentEnabled,
				api?.analytics?.actions,
				options?.isCommentEditor,
			),
		},

		nodes() {
			const { allowColumnResizing } = pluginConfig(options?.tableOptions);
			const isNestingSupported = fg('platform_editor_use_nested_table_pm_nodes');

			return isNestingSupported
				? [
						{
							name: 'table',
							node: tableNodeSpecWithFixedToDOM({
								allowColumnResizing: Boolean(allowColumnResizing),
								tableResizingEnabled: Boolean(options?.tableResizingEnabled),
								getEditorContainerWidth: defaultGetEditorContainerWidth,
								isNestingSupported,
							}),
						},
						{ name: 'tableHeader', node: tableHeaderWithNestedTable },
						{ name: 'tableRow', node: tableRowWithNestedTable },
						{ name: 'tableCell', node: tableCellWithNestedTable },
					]
				: [
						{
							name: 'table',
							node: tableNodeSpecWithFixedToDOM({
								allowColumnResizing: Boolean(allowColumnResizing),
								tableResizingEnabled: Boolean(options?.tableResizingEnabled),
								getEditorContainerWidth: defaultGetEditorContainerWidth,
								isNestingSupported,
							}),
						},
						{ name: 'tableHeader', node: tableHeader },
						{ name: 'tableRow', node: tableRow },
						{ name: 'tableCell', node: tableCell },
					];
		},

		pmPlugins() {
			const plugins: ReturnType<NonNullable<EditorPlugin['pmPlugins']>> = [
				{
					name: 'table',
					plugin: ({
						dispatchAnalyticsEvent,
						dispatch,
						portalProviderAPI,
						eventDispatcher,
						getIntl,
					}) => {
						const {
							fullWidthEnabled,
							wasFullWidthEnabled,
							tableResizingEnabled,

							tableOptions,
							getEditorFeatureFlags,
							dragAndDropEnabled,
							isTableScalingEnabled,
							isTableAlignmentEnabled,
							isCommentEditor,
							isChromelessEditor,
						} = options || ({} as TablePluginOptions);

						return createPlugin(
							dispatchAnalyticsEvent,
							dispatch,
							portalProviderAPI,
							eventDispatcher,
							pluginConfig(tableOptions),
							defaultGetEditorContainerWidth,
							getEditorFeatureFlags || defaultGetEditorFeatureFlags,
							getIntl,
							tableResizingEnabled,
							fullWidthEnabled,
							wasFullWidthEnabled,
							dragAndDropEnabled,
							editorAnalyticsAPI,
							api,
							isTableScalingEnabled,
							isTableAlignmentEnabled,
							shouldUseIncreasedScalingPercent,
							isCommentEditor,
							isChromelessEditor,
						);
					},
				},
				{
					name: 'tablePMColResizing',
					plugin: ({ dispatch }) => {
						const {
							fullWidthEnabled,
							tableOptions,
							getEditorFeatureFlags,
							isTableScalingEnabled,
							isNewColumnResizingEnabled,
							isTableAlignmentEnabled,
						} = options || ({} as TablePluginOptions);
						const { allowColumnResizing } = pluginConfig(tableOptions);
						return allowColumnResizing
							? createFlexiResizingPlugin(
									dispatch,
									{
										lastColumnResizable: !fullWidthEnabled,
									} as ColumnResizingPluginState,
									defaultGetEditorContainerWidth,
									getEditorFeatureFlags || defaultGetEditorFeatureFlags,
									api,
									editorAnalyticsAPI,
									isTableScalingEnabled || false,
									isNewColumnResizingEnabled,
									isTableAlignmentEnabled,
									!!options?.isCommentEditor,
								)
							: undefined;
					},
				},
				{ name: 'tableEditing', plugin: () => createDecorationsPlugin() },
				// Needs to be lower priority than editor-tables.tableEditing
				// plugin as it is currently swallowing backspace events inside tables
				{
					name: 'tableKeymap',
					plugin: ({ getIntl }) => {
						const {
							dragAndDropEnabled,
							isTableScalingEnabled = false,
							isTableAlignmentEnabled = false,
							fullWidthEnabled = false,
							isCommentEditor = false,
							isChromelessEditor = false,
							tableResizingEnabled = false,
						} = options || ({} as TablePluginOptions);

						return keymapPlugin(
							defaultGetEditorContainerWidth,
							api,
							editorAnalyticsAPI,
							dragAndDropEnabled,
							isTableScalingEnabled,
							isTableAlignmentEnabled,
							fullWidthEnabled,
							api,
							getIntl,
							isCellBackgroundDuplicated,
							isTableFixedColumnWidthsOptionEnabled,
							shouldUseIncreasedScalingPercent,
							isCommentEditor,
							isChromelessEditor,
							tableResizingEnabled,
						);
					},
				},
				{
					name: 'tableSelectionKeymap',
					plugin: ({ getIntl }) => tableSelectionKeymapPlugin(api, getIntl),
				},
				{
					name: 'tableEditing',
					plugin: () => {
						const { dragAndDropEnabled } = options || ({} as TablePluginOptions);

						return tableEditing({
							reportFixedTable: ({ tr, reason }: { tr: Transaction; reason: string }) => {
								editorAnalyticsAPI?.attachAnalyticsEvent({
									action: TABLE_ACTION.FIXED,
									actionSubject: ACTION_SUBJECT.TABLE,
									actionSubjectId: null,
									attributes: {
										reason,
									},
									eventType: EVENT_TYPE.TRACK,
								})(tr);
							},
							dragAndDropEnabled,
						}) as SafePlugin;
					},
				},
				{
					name: 'tableStickyHeaders',
					plugin: ({ dispatch, eventDispatcher }) =>
						options && options.tableOptions.stickyHeaders
							? createStickyHeadersPlugin(dispatch, () => [])
							: undefined,
				},
				{
					name: 'tableDragAndDrop',
					plugin: ({ dispatch }) => {
						return options?.dragAndDropEnabled
							? createDragAndDropPlugin(
									dispatch,
									editorAnalyticsAPI,
									options?.isTableScalingEnabled,
									isTableFixedColumnWidthsOptionEnabled,
									options.isCommentEditor,
								)
							: undefined;
					},
				},
				{
					name: 'tableViewModeSort',
					plugin: () => {
						return api?.editorViewMode ? createViewModeSortPlugin(api) : undefined;
					},
				},
				{
					name: 'tableLocalId',
					plugin: ({ dispatch }) => createTableLocalIdPlugin(dispatch),
				},
				{
					name: 'tableWidth',
					plugin: ({ dispatchAnalyticsEvent, dispatch }) =>
						options?.tableResizingEnabled
							? createTableWidthPlugin(
									dispatch,
									dispatchAnalyticsEvent,
									options?.fullWidthEnabled ?? false,
									options?.isTableScalingEnabled ?? false,
									options?.isTableAlignmentEnabled ?? false,
									options?.isCommentEditor ?? false,
								)
							: undefined,
				},
				{
					name: 'tableWidthInCommentFix',
					plugin: ({ dispatch }) =>
						options?.tableResizingEnabled && options?.isCommentEditor
							? createTableWidthInCommentFixPlugin(
									dispatch,
									options?.isTableAlignmentEnabled ?? false,
								)
							: undefined,
				},
				// TODO: should be deprecated and eventually replaced with 'tableAnalyticsPlugin'
				{
					name: 'tableOverflowAnalyticsPlugin',
					plugin: ({ dispatch, dispatchAnalyticsEvent }) =>
						createTableOverflowAnalyticsPlugin(
							dispatch,
							dispatchAnalyticsEvent,
							options?.tableResizingEnabled ?? false,
						),
				},
				{
					name: 'tableAnalyticsPlugin',
					plugin: ({ dispatch, dispatchAnalyticsEvent }) =>
						createTableAnalyticsPlugin(dispatch, dispatchAnalyticsEvent),
				},
				{
					name: 'tableGetEditorViewReferencePlugin',
					plugin: () => {
						return new SafePlugin({
							view: (editorView) => {
								editorViewRef.current = editorView;
								return {
									destroy: () => {
										editorViewRef.current = null;
									},
								};
							},
						});
					},
				},
			];

			// Workaround for table element breaking issue caused by composition event with an inputType of deleteCompositionText.
			// https://github.com/ProseMirror/prosemirror/issues/934
			if (browser.safari) {
				plugins.push({
					name: 'tableSafariDeleteCompositionTextIssueWorkaround',
					plugin: () => {
						return createTableSafariDeleteCompositionTextIssueWorkaroundPlugin();
					},
				});
			}

			return plugins;
		},

		contentComponent({
			editorView,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			dispatchAnalyticsEvent,
		}) {
			return (
				<ErrorBoundary
					component={ACTION_SUBJECT.TABLES_PLUGIN}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					fallbackComponent={null}
				>
					<GlobalStylesWrapper featureFlags={api?.featureFlags?.sharedState.currentState()} />
					<WithPluginState
						plugins={{
							tableAnalyticsPluginState: tableAnalyticsPluginKey,
							tablePluginState: pluginKey,
							tableWidthPluginState: tableWidthPluginKey,
							tableResizingPluginState: tableResizingPluginKey,
							stickyHeadersState: stickyHeadersPluginKey,
							dragAndDropState: dragAndDropPluginKey,
						}}
						render={({
							tableResizingPluginState: resizingPluginState,
							stickyHeadersState,
							tablePluginState,
							tableWidthPluginState,
							dragAndDropState,
						}) => {
							const isColumnResizing = resizingPluginState?.dragging;
							const isTableResizing = tableWidthPluginState?.resizing;
							const resizingTableLocalId = tableWidthPluginState?.tableLocalId;
							const resizingTableRef = tableWidthPluginState?.tableRef;
							const isResizing = isColumnResizing || isTableResizing;
							const widthToWidest = tablePluginState?.widthToWidest;

							const {
								tableNode,
								tablePos,
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
							} = tablePluginState!;

							const { allowControls } = pluginConfig;

							const stickyHeader = stickyHeadersState
								? findStickyHeaderForTable(stickyHeadersState, tablePos)
								: undefined;

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
											getEditorFeatureFlags={
												options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags
											}
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
											getEditorFeatureFlags={
												options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags
											}
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
											direction={dragAndDropState?.dragMenuDirection}
											index={dragAndDropState?.dragMenuIndex}
											isOpen={!!dragAndDropState?.isDragMenuOpen && !isResizing}
											getEditorContainerWidth={defaultGetEditorContainerWidth}
											editorAnalyticsAPI={editorAnalyticsAPI}
											stickyHeaders={stickyHeader}
											pluginConfig={pluginConfig}
											isTableScalingEnabled={options?.isTableScalingEnabled}
											getEditorFeatureFlags={
												options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags
											}
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
										(options?.tableResizingEnabled && options.isCommentEditor)) &&
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
						}}
					/>
				</ErrorBoundary>
			);
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'table',
					title: formatMessage(messages.table),
					description: formatMessage(messages.tableDescription),
					keywords: ['cell', 'table'],
					priority: 600,
					keyshortcut: tooltip(toggleTable),
					icon: () => <IconTable />,
					action(insert, state) {
						// see comment on tablesPlugin.getSharedState on usage
						const tableState = api?.table?.sharedState.currentState();

						const tableNode = createTableWithWidth({
							isTableScalingEnabled: options?.isTableScalingEnabled,
							isTableAlignmentEnabled: options?.isTableAlignmentEnabled,
							isFullWidthModeEnabled: tableState?.isFullWidthModeEnabled,
							isCommentEditor: options?.isCommentEditor,
							isChromelessEditor: options?.isChromelessEditor,
							isTableResizingEnabled: options?.tableResizingEnabled,
						})(state.schema);

						const tr = insert(tableNode);

						editorAnalyticsAPI?.attachAnalyticsEvent({
							action: ACTION.INSERTED,
							actionSubject: ACTION_SUBJECT.DOCUMENT,
							actionSubjectId: ACTION_SUBJECT_ID.TABLE,
							attributes: {
								inputMethod: INPUT_METHOD.QUICK_INSERT,
								localId: tableNode.attrs.localId,
							},
							eventType: EVENT_TYPE.TRACK,
						})(tr);
						return tr;
					},
				},
			],
			floatingToolbar: getToolbarConfig(
				defaultGetEditorContainerWidth,
				api,
				editorAnalyticsAPI,
				options?.getEditorFeatureFlags || defaultGetEditorFeatureFlags,
				() => editorViewRef.current,
				options,
				isTableFixedColumnWidthsOptionEnabled,
				shouldUseIncreasedScalingPercent,
			)(pluginConfig(options?.tableOptions)),
		},
	};
};

export default tablesPlugin;
