import { Schema, Mark } from 'prosemirror-model';
import { EditorState, ReadonlyTransaction, Selection } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
  findDomRefAtPos,
  NodeWithPos,
  DomAtPos,
} from 'prosemirror-utils';
import { closestElement } from '../../utils/dom';
import type { ExtensionState } from './types';
import { findNodePosByLocalIds } from '../../utils/nodes-by-localIds';

const getSelectedExtensionByTransaction = (
  transaction: ReadonlyTransaction,
  searchParent: boolean = true,
) => {
  return _getSelectedExtension(
    transaction.doc.type.schema,
    transaction.selection,
    searchParent,
  );
};

export const getSelectedExtension = (
  state: EditorState,
  searchParent: boolean = false,
) => {
  return _getSelectedExtension(state.schema, state.selection, searchParent);
};

const _getSelectedExtension = (
  schema: Schema,
  selection: Selection,
  searchParent: boolean,
) => {
  const { inlineExtension, extension, bodiedExtension } = schema.nodes;
  const nodeTypes = [extension, bodiedExtension, inlineExtension];

  return (
    findSelectedNodeOfType(nodeTypes)(selection) ||
    (searchParent && findParentNodeOfType(nodeTypes)(selection)) ||
    undefined
  );
};

export const findExtensionWithLocalId = (
  state: EditorState,
  localId?: string,
) => {
  const selectedExtension = getSelectedExtension(state, true);

  if (!localId) {
    return selectedExtension;
  }

  if (selectedExtension && selectedExtension.node.attrs.localId === localId) {
    return selectedExtension;
  }

  const { inlineExtension, extension, bodiedExtension } = state.schema.nodes;
  const nodeTypes = [extension, bodiedExtension, inlineExtension];
  let matched: NodeWithPos | undefined;

  state.doc.descendants((node, pos) => {
    if (nodeTypes.includes(node.type) && node.attrs.localId === localId) {
      matched = { node, pos };
    }
  });

  return matched;
};

export const getSelectedDomElement = (
  schema: Schema,
  domAtPos: DomAtPos,
  selectedExtensionNode: NodeWithPos,
) => {
  const selectedExtensionDomNode = findDomRefAtPos(
    selectedExtensionNode.pos,
    domAtPos,
  ) as HTMLElement;

  const isContentExtension =
    selectedExtensionNode.node.type !== schema.nodes.bodiedExtension;

  return (
    // Content extension can be nested in bodied-extension, the following check is necessary for that case
    (isContentExtension
      ? // Search down
        selectedExtensionDomNode.querySelector<HTMLElement>(
          '.extension-container',
        )
      : // Try searching up and then down
        closestElement(selectedExtensionDomNode, '.extension-container') ||
        selectedExtensionDomNode.querySelector<HTMLElement>(
          '.extension-container',
        )) || selectedExtensionDomNode
  );
};

export const getDataConsumerMark = (newNode: PMNode): Mark | undefined =>
  newNode.marks?.find((mark: Mark) => mark.type.name === 'dataConsumer');

export const getNodeTypesReferenced = (
  ids: string[],
  state: EditorState,
): string[] => {
  return findNodePosByLocalIds(state, ids, { includeDocNode: true }).map(
    ({ node }) => node.type.name,
  );
};

export const findNodePosWithLocalId = (
  state: EditorState,
  localId: string,
): NodeWithPos | undefined => {
  const nodes = findNodePosByLocalIds(state, [localId]);
  return nodes.length >= 1 ? nodes[0] : undefined;
};

export const onSelectionChanged = (
  tr: ReadonlyTransaction,
  state: ExtensionState,
): ExtensionState => {
  const selectedExtension = getSelectedExtensionByTransaction(tr, true);
  const hasUnselectedExtension = !!state.element && !selectedExtension;

  /*
   * We use this to indicate to our plugin that the selection has changed.
   *
   * - ignore if shouldRefreshEditButton already set
   * - restrict to scenarios when an extension is
   * - a) actually selected
   * - b) or un-selected (not accounting for selection extensionA -> extensionB)
   *
   * The rest of the logic will be handled in Extension main plugin view update().
   *
   * Known issue: typing inside of a bodiedExtension will trigger state changes each keystroke
   * as the toolbar always being open while it is focused.
   */
  if (
    !state.shouldRefreshEditButton &&
    (selectedExtension || hasUnselectedExtension)
  ) {
    return {
      ...state,
      shouldRefreshEditButton: true,
    };
  }

  return state;
};
