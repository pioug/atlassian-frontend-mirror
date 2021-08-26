import { Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { EditorPlugin } from '../../types';
import { TEXT_INPUT_RULE_TRANSACTION_KEY } from '@atlaskit/prosemirror-input-rules';

/**
 * Plugin to scroll the user's selection into view whenever the user updates
 * the document eg. inserting, deleting, formatting
 *
 * Behaviour is on by default, can be explicitly opted out of for a transaction by
 * setting scrollIntoView=false meta
 * We ignore collab transactions, appended transactions, transactions without steps,
 * transactions with addToHistory=false meta and typeahead trigger transactions
 */

export const scrollIntoViewPluginKey = new PluginKey('scrollIntoViewPlugin');

type TransactionWithScroll = Transaction & { scrolledIntoView: boolean };

const createPlugin = () =>
  new Plugin({
    key: scrollIntoViewPluginKey,
    appendTransaction: (transactions, oldState, newState) => {
      if (!transactions.length) {
        return;
      }

      const tr = transactions[0] as TransactionWithScroll;
      if (
        (tr.docChanged || tr.storedMarksSet) &&
        !tr.scrolledIntoView &&
        tr.getMeta('scrollIntoView') !== false &&
        // ignore anything we would not want to undo
        // this covers things like autofixing layouts, hovering table rows/cols
        tr.getMeta('addToHistory') !== false &&
        // ignore collab changes from another user
        !tr.getMeta('isRemote') &&
        // ignore any transaction coming from the input text rule plugin
        !tr.getMeta(TEXT_INPUT_RULE_TRANSACTION_KEY)
      ) {
        return newState.tr.scrollIntoView();
      }
    },
  });

const scrollIntoViewPlugin = (): EditorPlugin => ({
  name: 'scrollIntoView',
  pmPlugins() {
    return [{ name: 'scrollIntoView', plugin: () => createPlugin() }];
  },
});

export default scrollIntoViewPlugin;
