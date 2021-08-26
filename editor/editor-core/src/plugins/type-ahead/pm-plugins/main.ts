import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import { EditorReactContext } from '../../../types/editor-react-context';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Dispatch } from '../../../event-dispatcher';
import type {
  PopupMountPointReference,
  TypeAheadHandler,
  TypeAheadPluginState,
} from '../types';
import { TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE } from '../constants';
import { ACTIONS } from './actions';
import { pluginKey } from './key';
import { closest } from '../../../utils/dom';
import { createReducer } from './reducer';
import { factoryDecorations } from './decorations';
import { isInsertionTransaction } from './utils';

const hasTypeAheadStep = (tr: Transaction): InsertTypeAheadStep | null => {
  const step = tr.steps.find((step) => step instanceof InsertTypeAheadStep);

  if (!step) {
    return null;
  }

  return step as InsertTypeAheadStep;
};

type Props = {
  reactDispatch: Dispatch;
  popupMountRef: PopupMountPointReference;
  typeAheadHandlers: Array<TypeAheadHandler>;
  reactContext: () => EditorReactContext;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
};
export function createPlugin({
  reactDispatch,
  reactContext,
  popupMountRef,
  createAnalyticsEvent,
  typeAheadHandlers,
}: Props): Plugin {
  const intl = reactContext().intl;
  const { createDecorations, removeDecorations } = factoryDecorations({
    intl,
    popupMountRef,
    createAnalyticsEvent: createAnalyticsEvent,
  });
  const reducer = createReducer({
    createDecorations,
    removeDecorations,
    typeAheadHandlers,
    popupMountRef,
  });
  return new Plugin<TypeAheadPluginState>({
    key: pluginKey,

    state: {
      init() {
        return {
          typeAheadHandlers,
          query: '',
          decorationSet: DecorationSet.empty,
          decorationElement: null,
          items: [],
          selectedIndex: 0,
          stats: null,
          inputMethod: null,
        };
      },

      apply(tr, currentPluginState, oldEditorState, state) {
        const customStep = hasTypeAheadStep(tr);

        const nextPluginState = reducer(tr, currentPluginState, customStep);

        if (currentPluginState !== nextPluginState) {
          reactDispatch(pluginKey, nextPluginState);
        }

        return nextPluginState;
      },
    },

    appendTransaction(transactions, _oldState, newState) {
      const insertItemCallback = isInsertionTransaction(
        transactions,
        ACTIONS.INSERT_RAW_QUERY,
      );
      if (insertItemCallback) {
        const tr = insertItemCallback(newState);
        if (tr) {
          return tr;
        }
      }
    },

    view() {
      return {
        update(editorView) {},
      };
    },

    props: {
      decorations: (state: EditorState) => {
        return pluginKey.getState(state)?.decorationSet;
      },

      handleDOMEvents: {
        compositionend: (view, event: any) => {
          return false;
        },

        click: (view, event) => {
          const { target } = event;
          // ProseMirror view listen to any click event inside of it
          // When this event is coming from the typeahead
          // we should tell to ProseMirror to sit down and relax
          // cuz we know what we are doing (I hope)
          if (
            target instanceof HTMLElement &&
            closest(
              target,
              `[data-type-ahead=${TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE}]`,
            )
          ) {
            return true;
          }
          return false;
        },
      },
    },
  });
}
