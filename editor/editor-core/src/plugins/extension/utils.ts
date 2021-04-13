import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
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
