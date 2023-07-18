/**
 * A plugin for handle table custom widths
 * Has login to scan the document, add width value to table's width attribute when necessary
 * Also holds resizing state to hide / show table controls
 */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  akEditorFullWidthLayoutWidth,
  akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { ReplaceStep } from 'prosemirror-transform';
import { PluginKey } from 'prosemirror-state';
import { Dispatch } from '@atlaskit/editor-common/event-dispatcher';

type __ReplaceStep = ReplaceStep & {
  // Properties `to` and `from` are private attributes of ReplaceStep.
  to: number;
  from: number;
};

type TableWidthPluginState = {
  resizing: boolean;
};

export const pluginKey = new PluginKey<TableWidthPluginState>(
  'tableWidthPlugin',
);

const createPlugin = (dispatch: Dispatch, fullWidthEnabled: boolean) =>
  new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        return {
          resizing: false,
        };
      },
      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta && meta.resizing !== pluginState.resizing) {
          const newState = { resizing: meta.resizing };

          dispatch(pluginKey, newState);
          return newState;
        }

        return pluginState;
      },
    },
    appendTransaction: (transactions, _oldState, newState) => {
      // When document first load in Confluence, initially it is an empty document
      // and Collab service triggers a transaction to replace the empty document with the real document that should be rendered.
      // what we need to do is to add width attr to all tables in the real document
      // isReplaceDocumentOperation is checking if the transaction is the one that replace the empty document with the real document
      const isReplaceDocumentOperation = transactions.some((tr) => {
        if (tr.getMeta('replaceDocument')) {
          return true;
        }

        const hasStepReplacingEntireDocument = tr.steps.some((step) => {
          if (!(step instanceof ReplaceStep)) {
            return false;
          }

          const isStepReplacingFromDocStart =
            (step as __ReplaceStep).from === 0;
          const isStepReplacingUntilTheEndOfDocument =
            (step as __ReplaceStep).to === _oldState.doc.content.size;

          if (
            !isStepReplacingFromDocStart ||
            !isStepReplacingUntilTheEndOfDocument
          ) {
            return false;
          }
          return true;
        });

        return hasStepReplacingEntireDocument;
      });

      if (!isReplaceDocumentOperation) {
        return null;
      }

      const tr = newState.tr;
      const { table } = newState.schema.nodes;

      newState.doc.forEach((node, offset) => {
        if (node.type === table) {
          const width = node.attrs.width;
          const layout = node.attrs.layout;

          if (!width && layout) {
            let tableWidthCal;

            if (fullWidthEnabled) {
              tableWidthCal = akEditorFullWidthLayoutWidth;
            } else {
              switch (layout) {
                case 'wide':
                  tableWidthCal = akEditorWideLayoutWidth;
                  break;
                case 'full-width':
                  tableWidthCal = akEditorFullWidthLayoutWidth;
                  break;
                // when in fix-width apprearance, no need to assign value to table width attr
                // as when table is created, width attr is null by default, table rendered using layout attr
                default:
                  break;
              }
            }

            const { width, ...rest } = node.attrs;

            if (tableWidthCal) {
              tr.step(
                new SetAttrsStep(offset, {
                  width: tableWidthCal,
                  ...rest,
                }),
              );
            }
          }
        }
      });
      return tr;
    },
  });

export { createPlugin };
