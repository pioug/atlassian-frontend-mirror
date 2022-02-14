/**
 * This plugin ensures that certain nodes (such as tables, and various extension ones)
 * have a unique `localId` attribute value for `fragment` marks.
 * It also ensures the preservation of these IDs when nodes are being cut-and-pasted
 * around the document.
 *
 * The implementation has been _heavily_ borrowed from
 * - packages/editor/editor-core/src/plugins/table/pm-plugins/table-local-id.ts
 */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, Transaction } from 'prosemirror-state';
import { NodeType, Schema, Node as ProsemirrorNode } from 'prosemirror-model';

import { uuid } from '@atlaskit/adf-schema';

import { stepAddsOneOf } from '../../../utils/step';
import { Dispatch } from '../../../event-dispatcher';

const pluginKey = new PluginKey('fragmentMarkConsistencyPlugin');

/**
 * Traverses a transaction's steps to see if we're inserting a node which supports a fragment mark
 */
const checkIsAddingSupportedNode = (
  schema: Schema,
  transaction: Transaction,
) => {
  const nodesSupportingFragmentMark = getNodesSupportingFragmentMark(schema);
  return transaction.steps.some((step) =>
    nodesSupportingFragmentMark.some((nodeType) =>
      stepAddsOneOf(step, new Set([nodeType])),
    ),
  );
};

const getNodesSupportingFragmentMark = (schema: Schema): NodeType[] => {
  const { table, extension, bodiedExtension, inlineExtension } = schema.nodes;
  return [table, extension, bodiedExtension, inlineExtension];
};

const regenerateFragmentIdIfNeeded = ({
  transaction,
  schema,
  doc,
  shouldRegenerateLocalId,
}: {
  transaction: Transaction<any>;
  schema: Schema;
  doc: ProsemirrorNode;
  shouldRegenerateLocalId(localId: string): boolean;
}): { transactionChanged: boolean } => {
  const { fragment } = schema.marks;
  const nodesSupportingFragmentMark = getNodesSupportingFragmentMark(schema);

  let transactionChanged = false;

  doc.descendants((node, pos) => {
    const isSupportedNode = nodesSupportingFragmentMark.some(
      (supportedNode) => node.type === supportedNode,
    );
    if (!isSupportedNode) {
      // continue traversing
      return true;
    }

    const existingFragmentMark = node.marks.find(
      (mark) => mark.type === fragment,
    );
    if (!existingFragmentMark) {
      // continue traversing
      return true;
    }

    if (shouldRegenerateLocalId(existingFragmentMark.attrs.localId)) {
      transactionChanged = true;

      transaction.setNodeMarkup(
        pos,
        undefined,
        node.attrs,
        node.marks.map((mark) => {
          if (mark.type === fragment) {
            mark.attrs.localId = uuid.generate();
          }

          return mark;
        }),
      );
    }

    /**
     * Continue traversing, as we can encounter inline extension nodes pretty much anywhere
     */
    return true;
  });

  return { transactionChanged };
};

/**
 * Ensures presence of `fragment` mark on certain node types and the uniqueness of their `localId` attributes
 */
export const createPlugin = (dispatch: Dispatch) =>
  new SafePlugin({
    key: pluginKey,
    appendTransaction: (transactions, _oldState, newState) => {
      let modified = false;
      const tr = newState.tr;

      transactions.forEach((transaction) => {
        const fragmentLocalIdsObserved = new Set<string>();
        if (!transaction.docChanged) {
          return;
        }

        // Don't interfere with cut as it clashes with fixTables & we don't need
        // to handle any extra cut cases in this plugin
        const uiEvent = transaction.getMeta('uiEvent');
        if (uiEvent === 'cut') {
          return;
        }

        /** Check if we're actually inserting a supported node, otherwise we can ignore this tr */
        const isAddingSupportedNode = checkIsAddingSupportedNode(
          newState.schema,
          transaction,
        );
        if (!isAddingSupportedNode) {
          return;
        }

        const { transactionChanged } = regenerateFragmentIdIfNeeded({
          doc: newState.doc,
          schema: newState.schema,
          transaction: tr,
          shouldRegenerateLocalId: (localId: string) => {
            if (fragmentLocalIdsObserved.has(localId)) {
              return true;
            }

            fragmentLocalIdsObserved.add(localId);
            return false;
          },
        });

        if (transactionChanged) {
          modified = true;
        }
      });

      if (modified) {
        return tr;
      }
      return;
    },
  });
