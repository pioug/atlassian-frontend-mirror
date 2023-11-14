import type {
  Schema,
  Mark,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos, DomAtPos } from '@atlaskit/editor-prosemirror/utils';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
  findDomRefAtPos,
} from '@atlaskit/editor-prosemirror/utils';
import {
  findNodePosByLocalIds,
  closestElement,
} from '@atlaskit/editor-common/utils';

export const getSelectedExtension = (
  state: EditorState,
  searchParent: boolean = false,
) => {
  const { inlineExtension, extension, bodiedExtension } = state.schema.nodes;
  const nodeTypes = [extension, bodiedExtension, inlineExtension];
  return (
    findSelectedNodeOfType(nodeTypes)(state.selection) ||
    (searchParent && findParentNodeOfType(nodeTypes)(state.selection)) ||
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
