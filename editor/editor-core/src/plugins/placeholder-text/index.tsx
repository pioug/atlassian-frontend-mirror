import React from 'react';
import { Node as PmNode } from 'prosemirror-model';
import {
  NodeSelection,
  Plugin,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { placeholder } from '@atlaskit/adf-schema';
import MediaServicesTextIcon from '@atlaskit/icon/glyph/media-services/text';
import { getPosHandler } from '../../nodeviews/types';
import { EditorPlugin } from '../../types/editor-plugin';
import WithPluginState from '../../ui/WithPluginState';
import { Dispatch } from '../../event-dispatcher';
import { isNodeEmpty } from '../../utils';
import { FakeTextCursorSelection } from '../fake-text-cursor/cursor';
import PlaceholderFloatingToolbar from './ui/PlaceholderFloatingToolbar';
import {
  hidePlaceholderFloatingToolbar,
  insertPlaceholderTextAtSelection,
} from './actions';
import { PlaceholderTextNodeView } from './placeholder-text-nodeview';
import { pluginKey } from './plugin-key';
import { PlaceholderTextOptions, PluginState } from './types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';

export function createPlugin(
  dispatch: Dispatch<PluginState>,
  options: PlaceholderTextOptions,
): Plugin | undefined {
  const allowInserting = !!options.allowInserting;
  return new Plugin({
    key: pluginKey,
    state: {
      init: () =>
        ({
          showInsertPanelAt: null,
          allowInserting,
        } as PluginState),
      apply: (tr: Transaction, state: PluginState) => {
        const meta = tr.getMeta(pluginKey) as Partial<PluginState>;
        if (meta && meta.showInsertPanelAt !== undefined) {
          const newState = {
            showInsertPanelAt: meta.showInsertPanelAt,
            allowInserting,
          };
          dispatch(pluginKey, newState);
          return newState;
        } else if (state.showInsertPanelAt) {
          const newState = {
            showInsertPanelAt: tr.mapping.map(state.showInsertPanelAt),
            allowInserting,
          };
          dispatch(pluginKey, newState);
          return newState;
        }
        return state;
      },
    },
    appendTransaction(transactions, oldState, newState) {
      if (transactions.some((txn) => txn.docChanged)) {
        const didPlaceholderExistBeforeTxn =
          oldState.selection.$head.nodeAfter ===
          newState.selection.$head.nodeAfter;
        const adjacentNode = newState.selection.$head.nodeAfter;
        const adjacentNodePos = newState.selection.$head.pos;
        const placeholderNodeType = newState.schema.nodes.placeholder;
        if (
          adjacentNode &&
          adjacentNode.type === placeholderNodeType &&
          didPlaceholderExistBeforeTxn
        ) {
          // Check that cursor has moved forward in the document **and** that there is content before the cursor
          const wasContentAdded =
            oldState.selection.$head.pos < newState.selection.$head.pos &&
            !isNodeEmpty(newState.selection.$head.nodeBefore!);
          if (wasContentAdded) {
            const { $from, $to } = NodeSelection.create(
              newState.doc,
              adjacentNodePos,
            );
            return newState.tr.deleteRange($from.pos, $to.pos);
          }
        }
      }

      // Handle Fake Text Cursor for Floating Toolbar
      if (
        !(pluginKey.getState(oldState) as PluginState).showInsertPanelAt &&
        (pluginKey.getState(newState) as PluginState).showInsertPanelAt
      ) {
        return newState.tr.setSelection(
          new FakeTextCursorSelection(newState.selection.$from),
        );
      }
      if (
        (pluginKey.getState(oldState) as PluginState).showInsertPanelAt &&
        !(pluginKey.getState(newState) as PluginState).showInsertPanelAt
      ) {
        if (newState.selection instanceof FakeTextCursorSelection) {
          return newState.tr.setSelection(
            new TextSelection(newState.selection.$from),
          );
        }
      }
      return;
    },
    props: {
      nodeViews: {
        placeholder: (node: PmNode, view: EditorView, getPos: getPosHandler) =>
          new PlaceholderTextNodeView(node, view, getPos),
      },
    },
  });
}

const basePlaceholderTextPlugin = (
  options: PlaceholderTextOptions,
): EditorPlugin => ({
  name: 'placeholderText',

  nodes() {
    return [{ name: 'placeholder', node: placeholder }];
  },

  pmPlugins() {
    return [
      {
        name: 'placeholderText',
        plugin: ({ dispatch }) => createPlugin(dispatch, options),
      },
    ];
  },

  contentComponent({ editorView, popupsMountPoint, popupsBoundariesElement }) {
    const insertPlaceholderText = (value: string) =>
      insertPlaceholderTextAtSelection(value)(
        editorView.state,
        editorView.dispatch,
      );
    const hidePlaceholderToolbar = () =>
      hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
    const getNodeFromPos = (pos: number) => editorView.domAtPos(pos).node;
    const getFixedCoordinatesFromPos = (pos: number) =>
      editorView.coordsAtPos(pos);
    const setFocusInEditor = () => editorView.focus();

    return (
      <WithPluginState
        plugins={{ placeholderTextState: pluginKey }}
        render={({ placeholderTextState = {} as PluginState }) => {
          if (placeholderTextState.showInsertPanelAt) {
            return (
              <PlaceholderFloatingToolbar
                editorViewDOM={editorView.dom as HTMLElement}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                getFixedCoordinatesFromPos={getFixedCoordinatesFromPos}
                getNodeFromPos={getNodeFromPos}
                hidePlaceholderFloatingToolbar={hidePlaceholderToolbar}
                showInsertPanelAt={placeholderTextState.showInsertPanelAt}
                insertPlaceholder={insertPlaceholderText}
                setFocusInEditor={setFocusInEditor}
              />
            );
          }
          return null;
        }}
      />
    );
  },
});

const decorateWithPluginOptions = (
  plugin: EditorPlugin,
  options: PlaceholderTextOptions,
): EditorPlugin => {
  if (!options.allowInserting) {
    return plugin;
  }

  plugin.pluginsOptions = {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'placeholderText',
        title: formatMessage(messages.placeholderText),
        description: formatMessage(messages.placeholderTextDescription),
        priority: 1400,
        keywords: ['placeholder'],
        icon: () => <MediaServicesTextIcon label="" />,
        action(insert, state) {
          const tr = insert(state.schema.nodes.placeholder.createChecked());
          tr.setMeta(pluginKey, { showInsertPanelAt: tr.selection.anchor });

          return addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.PLACEHOLDER_TEXT,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            },
            eventType: EVENT_TYPE.TRACK,
          });
        },
      },
    ],
  };
  return plugin;
};

const placeholderTextPlugin = (options: PlaceholderTextOptions): EditorPlugin =>
  decorateWithPluginOptions(basePlaceholderTextPlugin(options), options);

export default placeholderTextPlugin;
