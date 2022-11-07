import { Node as PMNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export const isReferencedSource = (
  state: EditorState,
  node?: PMNode,
): boolean => {
  if (!node) {
    return false;
  }

  let found = false;

  // Handle nodes having 2 uuids. They could have a localId or a fragment. Regardless this needs
  // to check if either id is used by a data consumer.
  const localIds = new Set<string>(
    [
      node.attrs?.localId,
      node.marks?.find((mark) => mark.type === state.schema.marks.fragment)
        ?.attrs?.localId,
    ].filter(Boolean),
  );

  // If there are no uuids on the node then it's not possible for it to be referenced anywhere.
  if (!localIds.size) {
    return false;
  }

  state.doc.descendants((node) => {
    if (found) {
      return false;
    }

    const dataConsumer = node.marks.find(
      (mark) => mark.type === state.schema.marks.dataConsumer,
    );

    if (!dataConsumer) {
      return true;
    }

    found =
      dataConsumer.attrs.sources?.some((src: string) => localIds.has(src)) ??
      false;

    return !found;
  });

  return found;
};
