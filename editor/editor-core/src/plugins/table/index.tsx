import { table, tableCell, tableHeader, tableRow } from '@atlaskit/adf-schema';
import { tableEditing } from 'prosemirror-tables';
import { createTable } from 'prosemirror-utils';
import React from 'react';
import { toggleTable, tooltip } from '../../keymaps';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { IconTable } from '../quick-insert/assets';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import {
  createPlugin as createFlexiResizingPlugin,
  pluginKey as tableResizingPluginKey,
} from './pm-plugins/table-resizing';
import { getToolbarConfig } from './toolbar';
import { ColumnResizingPluginState, PluginConfig } from './types';
import FloatingContextualButton from './ui/FloatingContextualButton';
import FloatingContextualMenu from './ui/FloatingContextualMenu';
import FloatingDeleteButton from './ui/FloatingDeleteButton';
import FloatingInsertButton from './ui/FloatingInsertButton';
import LayoutButton from './ui/LayoutButton';
import { isLayoutSupported } from './utils';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { getPluginState, pluginKey } from './pm-plugins/plugin-factory';
import { pluginConfig } from './create-plugin-config';
import { createPlugin as createDecorationsPlugin } from './pm-plugins/decorations/plugin';

interface TablePluginOptions {
  tableOptions: PluginConfig;
  dynamicSizingEnabled?: boolean;
  breakoutEnabled?: boolean;
  allowContextualMenu?: boolean;
  // TODO these two need to be rethought
  fullWidthEnabled?: boolean;
  wasFullWidthEnabled?: boolean;
}

const tablesPlugin = (options?: TablePluginOptions): EditorPlugin => ({
  name: 'table',

  nodes() {
    return [
      { name: 'table', node: table },
      { name: 'tableHeader', node: tableHeader },
      { name: 'tableRow', node: tableRow },
      { name: 'tableCell', node: tableCell },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'table',
        plugin: ({ dispatch, portalProviderAPI, eventDispatcher }) => {
          const {
            dynamicSizingEnabled,
            fullWidthEnabled,
            wasFullWidthEnabled,
            breakoutEnabled,
            tableOptions,
          } = options || ({} as TablePluginOptions);
          return createPlugin(
            dispatch,
            portalProviderAPI,
            eventDispatcher,
            pluginConfig(tableOptions),
            breakoutEnabled && dynamicSizingEnabled,
            breakoutEnabled,
            fullWidthEnabled,
            wasFullWidthEnabled,
          );
        },
      },
      {
        name: 'tablePMColResizing',
        plugin: ({ dispatch }) => {
          const { dynamicSizingEnabled, fullWidthEnabled, tableOptions } =
            options || ({} as TablePluginOptions);
          const { allowColumnResizing } = pluginConfig(tableOptions);
          return allowColumnResizing
            ? createFlexiResizingPlugin(dispatch, {
                dynamicTextSizing: dynamicSizingEnabled && !fullWidthEnabled,
                lastColumnResizable: !fullWidthEnabled,
              } as ColumnResizingPluginState)
            : undefined;
        },
      },
      { name: 'tableEditing', plugin: () => createDecorationsPlugin() },
      // Needs to be lower priority than prosemirror-tables.tableEditing
      // plugin as it is currently swallowing backspace events inside tables
      { name: 'tableKeymap', plugin: () => keymapPlugin() },
      { name: 'tableEditing', plugin: () => tableEditing() },
    ];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    return (
      <WithPluginState
        plugins={{
          pluginState: pluginKey,
          tableResizingPluginState: tableResizingPluginKey,
        }}
        render={_ => {
          const { state } = editorView;
          const pluginState = getPluginState(state);
          const resizingPluginState = tableResizingPluginKey.getState(state);
          const isDragging =
            resizingPluginState && resizingPluginState.dragging;
          const {
            tableNode,
            targetCellPosition,
            isContextualMenuOpen,
            layout,
            tableRef,
            pluginConfig,
            insertColumnButtonIndex,
            insertRowButtonIndex,
            isHeaderColumnEnabled,
            isHeaderRowEnabled,
            tableWrapperTarget,
          } = pluginState || {};
          const allowControls = pluginConfig && pluginConfig.allowControls;

          return (
            <>
              {targetCellPosition &&
                tableRef &&
                !isDragging &&
                options &&
                options.allowContextualMenu && (
                  <FloatingContextualButton
                    isNumberColumnEnabled={
                      tableNode && tableNode.attrs.isNumberColumnEnabled
                    }
                    editorView={editorView}
                    mountPoint={popupsMountPoint}
                    targetCellPosition={targetCellPosition}
                    scrollableElement={popupsScrollableElement}
                    isContextualMenuOpen={isContextualMenuOpen}
                    layout={layout}
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
                  editorView={editorView}
                  mountPoint={popupsMountPoint}
                  boundariesElement={popupsBoundariesElement}
                  scrollableElement={popupsScrollableElement}
                />
              )}
              <FloatingContextualMenu
                editorView={editorView}
                mountPoint={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                targetCellPosition={targetCellPosition}
                isOpen={Boolean(isContextualMenuOpen)}
                pluginConfig={pluginConfig}
              />
              {allowControls && (
                <FloatingDeleteButton
                  editorView={editorView}
                  selection={editorView.state.selection}
                  tableRef={tableRef as HTMLTableElement}
                  mountPoint={popupsMountPoint}
                  boundariesElement={popupsBoundariesElement}
                  scrollableElement={popupsScrollableElement}
                />
              )}
              {isLayoutSupported(state) &&
                options &&
                options.breakoutEnabled && (
                  <LayoutButton
                    editorView={editorView}
                    mountPoint={popupsMountPoint}
                    boundariesElement={popupsBoundariesElement}
                    scrollableElement={popupsScrollableElement}
                    targetRef={tableWrapperTarget!}
                    layout={layout}
                    isResizing={
                      !!resizingPluginState && !!resizingPluginState.dragging
                    }
                  />
                )}
            </>
          );
        }}
      />
    );
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'table',
        title: formatMessage(messages.table),
        description: formatMessage(messages.tableDescription),
        keywords: ['cell'],
        priority: 600,
        keyshortcut: tooltip(toggleTable),
        icon: () => <IconTable label={formatMessage(messages.table)} />,
        action(insert, state) {
          const tr = insert(createTable(state.schema));
          return addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.TABLE,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.TRACK,
          });
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
});

export default tablesPlugin;
