import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { uuid } from '@atlaskit/adf-schema';

import { stepAddsOneOf } from '@atlaskit/editor-common/utils';

const pluginKey = new PluginKey('extensionUniqueIdPlugin');

const createPlugin = () =>
  new SafePlugin({
    // TODO: @see ED-8839
    appendTransaction: (transactions, _oldState, newState) => {
      const tr = newState.tr;
      const selectionBookmark = tr.selection.getBookmark();
      let modified = false;
      const { extension, bodiedExtension, inlineExtension } =
        newState.schema.nodes;

      const extensionTypes = new Set([
        extension,
        bodiedExtension,
        inlineExtension,
      ]);
      const idsObserved = new Set<string>();

      transactions.forEach((transaction) => {
        if (!transaction.docChanged) {
          return;
        }

        const isAddingExtension = transaction.steps.some((step) =>
          stepAddsOneOf(step, extensionTypes),
        );
        if (isAddingExtension) {
          // Can't simply look at changed nodes, as we could be adding an extension
          newState.doc.descendants((node, pos) => {
            const localId = node.attrs.localId;

            // Dealing with an extension - make sure it's a unique ID
            if (!!node.type && extensionTypes.has(node.type)) {
              if (localId && !idsObserved.has(localId)) {
                idsObserved.add(localId);
                // Also add a localId if it happens to not have one,
              } else if (!localId || idsObserved.has(localId)) {
                modified = true;
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  localId: uuid.generate(),
                });
              }
              /**
               * If it's a bodiedExtension, we'll need to keep digging; since we
               * can have more extension nodes within the contents of that
               */
              if (node.type === bodiedExtension) {
                return true;
              }
              return false;
            }

            /**
             * Otherwise continue traversing, we can encounter extensions nested in
             * expands/bodiedExtensions
             */
            return true;
          });
        }
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
