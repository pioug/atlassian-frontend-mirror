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

export const getSelectedNonContentExtension = ({
  schema,
  selection,
}: EditorState): NodeWithPos | undefined => {
  const { inlineExtension, extension } = schema.nodes;
  return findSelectedNodeOfType([inlineExtension, extension])(selection);
};

export const getSelectedDomElement = (
  domAtPos: DomAtPos,
  selectedExtensionNode?: NodeWithPos,
  isContentExtension: boolean = false,
) => {
  const selectedExtensionDomNode =
    selectedExtensionNode &&
    (findDomRefAtPos(selectedExtensionNode.pos, domAtPos) as HTMLElement);

  // Non-content extension can be nested in bodied-extension, the following check is necessary for that case
  return selectedExtensionNode && selectedExtensionDomNode!.querySelector
    ? isContentExtension
      ? selectedExtensionDomNode!.querySelector<HTMLElement>(
          '.extension-container',
        ) || selectedExtensionDomNode
      : closestElement(selectedExtensionDomNode!, '.extension-container') ||
        selectedExtensionDomNode!.querySelector<HTMLElement>(
          '.extension-container',
        ) ||
        selectedExtensionDomNode
    : undefined;
};
