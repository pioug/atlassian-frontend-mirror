import { Schema, Mark } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
  findDomRefAtPos,
  NodeWithPos,
  DomAtPos,
} from 'prosemirror-utils';
import { closestElement } from '../../utils/dom';

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
  const nodeTypesReferenced: string[] = [];

  ids.map((id: string) => {
    if (state.doc.attrs.localId === id) {
      nodeTypesReferenced.push(state.doc.type.name);
    }
    state.doc.descendants((node: PMNode) => {
      if (node.attrs.localId === id) {
        nodeTypesReferenced.push(node.type.name);
      }
      return true;
    });
  });
  return nodeTypesReferenced;
};
