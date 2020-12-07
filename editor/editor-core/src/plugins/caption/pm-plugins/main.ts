import {
  EditorState,
  Plugin,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { pluginKey } from './plugin-key';
import captionNodeView from './../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EventDispatcher, Dispatch } from '../../../event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common';

export default (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  dispatch: Dispatch,
) =>
  new Plugin({
    appendTransaction(
      _transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ): Transaction | void {
      if (
        !newState.selection.eq(oldState.selection) &&
        oldState.selection instanceof TextSelection &&
        oldState.selection.empty
      ) {
        const oldSelectedNode = oldState.doc.nodeAt(
          oldState.selection.from - 1,
        );

        if (
          oldSelectedNode &&
          oldSelectedNode.type === oldState.schema.nodes.caption &&
          oldSelectedNode.childCount === 0
        ) {
          const { tr } = newState;
          tr.delete(oldState.selection.from - 1, oldState.selection.from);
          tr.setMeta('scrollIntoView', false);
          return tr;
        }
      }
    },
    key: pluginKey,
    props: {
      nodeViews: {
        caption: captionNodeView(portalProviderAPI, eventDispatcher),
      },
    },
  });
