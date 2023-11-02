import React from 'react';

import { placeholder } from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  ExtractInjectionAPI,
  UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { isNodeEmpty } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import MediaServicesTextIcon from '@atlaskit/icon/glyph/media-services/text';

import {
  hidePlaceholderFloatingToolbar,
  insertPlaceholderTextAtSelection,
  showPlaceholderFloatingToolbar,
} from './actions';
import {
  drawFakeTextCursor,
  FakeTextCursorSelection,
} from './fake-text-cursor/cursor';
import { PlaceholderTextNodeView } from './placeholder-text-nodeview';
import { pluginKey } from './plugin-key';
import { isSelectionAtPlaceholder } from './selection-utils';
import type {
  PlaceholderTextOptions,
  PlaceholderTextPlugin,
  PlaceholderTextPluginState,
} from './types';
import PlaceholderFloatingToolbar from './ui/PlaceholderFloatingToolbar';

const getOpenTypeAhead = (
  trigger: string,
  api: ExtractInjectionAPI<PlaceholderTextPlugin> | undefined,
) => {
  const typeAheadHandler =
    api?.typeAhead?.actions?.findHandlerByTrigger(trigger);
  if (!typeAheadHandler || !typeAheadHandler.id) {
    return null;
  }

  return api?.typeAhead?.actions?.openAtTransaction({
    triggerHandler: typeAheadHandler,
    inputMethod: INPUT_METHOD.KEYBOARD,
  });
};

export function createPlugin(
  dispatch: Dispatch<PlaceholderTextPluginState>,
  options: PlaceholderTextOptions,
  api: ExtractInjectionAPI<PlaceholderTextPlugin> | undefined,
): SafePlugin | undefined {
  const allowInserting = !!options.allowInserting;
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: () =>
        ({
          showInsertPanelAt: null,
          allowInserting,
        } as PlaceholderTextPluginState),
      apply: (tr: ReadonlyTransaction, state: PlaceholderTextPluginState) => {
        const meta = tr.getMeta(
          pluginKey,
        ) as Partial<PlaceholderTextPluginState>;
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
      if (transactions.some(txn => txn.docChanged)) {
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
          const { $head: $newHead } = newState.selection;
          const { $head: $oldHead } = oldState.selection;
          // Check that cursor has moved forward in the document **and** that there is content before the cursor
          const cursorMoved = $oldHead.pos < $newHead.pos;
          const nodeBeforeHasContent = !isNodeEmpty($newHead.nodeBefore!);
          const nodeBeforeIsInline = $newHead.nodeBefore?.type.isInline;

          if (cursorMoved && (nodeBeforeHasContent || nodeBeforeIsInline)) {
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
        !(pluginKey.getState(oldState) as PlaceholderTextPluginState)
          .showInsertPanelAt &&
        (pluginKey.getState(newState) as PlaceholderTextPluginState)
          .showInsertPanelAt
      ) {
        return newState.tr.setSelection(
          new FakeTextCursorSelection(newState.selection.$from),
        );
      }
      if (
        (pluginKey.getState(oldState) as PlaceholderTextPluginState)
          .showInsertPanelAt &&
        !(pluginKey.getState(newState) as PlaceholderTextPluginState)
          .showInsertPanelAt
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
      decorations: drawFakeTextCursor,
      handleDOMEvents: {
        beforeinput: (view, event) => {
          const { state } = view;
          if (
            event instanceof InputEvent &&
            !event.isComposing &&
            event.inputType === 'insertText' &&
            isSelectionAtPlaceholder(view.state.selection)
          ) {
            event.stopPropagation();
            event.preventDefault();

            const startNodePosition = state.selection.from;
            const content = event.data || '';
            const tr = view.state.tr;

            tr.delete(startNodePosition, startNodePosition + 1);

            const openTypeAhead = getOpenTypeAhead(content, api);
            if (openTypeAhead) {
              openTypeAhead(tr);
            } else {
              tr.insertText(content);
            }

            view.dispatch(tr);
            return true;
          }

          return false;
        },
      },
      nodeViews: {
        placeholder: (node: PmNode, view: EditorView, getPos: getPosHandler) =>
          new PlaceholderTextNodeView(node, view, getPos),
      },
    },
  });
}

type ContentComponentProps = Pick<
  UiComponentFactoryParams,
  | 'editorView'
  | 'dispatchAnalyticsEvent'
  | 'popupsMountPoint'
  | 'popupsBoundariesElement'
  | 'popupsScrollableElement'
> & {
  dependencyApi: ExtractInjectionAPI<typeof placeholderTextPlugin> | undefined;
};

function ContentComponent({
  editorView,
  dependencyApi,
  popupsMountPoint,
  popupsBoundariesElement,
}: ContentComponentProps): JSX.Element | null {
  const { placeholderTextState } = useSharedPluginState(dependencyApi, [
    'placeholderText',
  ]);

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

  if (placeholderTextState?.showInsertPanelAt) {
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
}

const basePlaceholderTextPlugin: PlaceholderTextPlugin = ({
  api,
  config: options,
}) => ({
  name: 'placeholderText',

  nodes() {
    return [{ name: 'placeholder', node: placeholder }];
  },

  pmPlugins() {
    return [
      {
        name: 'placeholderText',
        plugin: ({ dispatch }) => createPlugin(dispatch, options, api),
      },
    ];
  },

  actions: {
    showPlaceholderFloatingToolbar,
  },

  getSharedState(editorState) {
    if (!editorState) {
      return undefined;
    }

    const { showInsertPanelAt, allowInserting } = pluginKey.getState(
      editorState,
    ) || { showInsertPanelAt: null };
    return {
      showInsertPanelAt,
      allowInserting: !!allowInserting,
    };
  },

  contentComponent({ editorView, popupsMountPoint, popupsBoundariesElement }) {
    return (
      <ContentComponent
        editorView={editorView}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        dependencyApi={api}
      />
    );
  },
});

const decorateWithPluginOptions = (
  plugin: ReturnType<PlaceholderTextPlugin>,
  options: PlaceholderTextOptions,
  api: ExtractInjectionAPI<typeof placeholderTextPlugin> | undefined,
) => {
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
          const tr = state.tr;
          tr.setMeta(pluginKey, { showInsertPanelAt: tr.selection.anchor });

          api?.analytics?.actions.attachAnalyticsEvent({
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.PLACEHOLDER_TEXT,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            },
            eventType: EVENT_TYPE.TRACK,
          })(tr);
          return tr;
        },
      },
    ],
  };
  return plugin;
};

const placeholderTextPlugin: PlaceholderTextPlugin = ({
  config: options = {},
  api,
}) =>
  decorateWithPluginOptions(
    basePlaceholderTextPlugin({ config: options, api }),
    options,
    api,
  );

export default placeholderTextPlugin;
