import { Plugin, PluginKey } from 'prosemirror-state';
import { uuid } from '@atlaskit/adf-schema';
import { nodesBetweenChanged } from '../../../utils';

const pluginKey = new PluginKey('extensionUniqueIdPlugin');

const createPlugin = () =>
  new Plugin({
    // TODO: @see ED-8839
    appendTransaction: (transactions, _oldState, newState) => {
      const tr = newState.tr;
      const selectionBookmark = tr.selection.getBookmark();
      let modified = false;
      transactions.forEach((transaction) => {
        if (!transaction.docChanged) {
          return;
        }

        // Adds a unique id to a node
        nodesBetweenChanged(transaction, (node, pos) => {
          const {
            extension,
            bodiedExtension,
            inlineExtension,
          } = newState.schema.nodes;
          if (
            !!node.type &&
            (node.type === extension ||
              node.type === bodiedExtension ||
              node.type === inlineExtension)
          ) {
            const { localId, ...rest } = node.attrs;
            if (!localId) {
              tr.setNodeMarkup(pos, undefined, {
                localId: uuid.generate(),
                ...rest,
              });
              modified = true;
            }
          }
        });
      });

      if (modified) {
        // We want to restore to the original selection but w/o applying the mapping
        // @see https://github.com/ProseMirror/prosemirror/issues/645
        return tr.setSelection(selectionBookmark.resolve(tr.doc));
      }
      return;
    },
    key: pluginKey,
  });

export { createPlugin };
