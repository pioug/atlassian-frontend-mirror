import { ReplaceAroundStep } from 'prosemirror-transform';
import { Transaction } from 'prosemirror-state';
import { Node, Fragment, Slice } from 'prosemirror-model';

// adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L206:L231
export const indentList = (tr: Transaction) => {
  const { $from, $to } = tr.selection;
  const { listItem } = tr.doc.type.schema.nodes;
  const range = $from.blockRange(
    $to,
    (node: Node) =>
      !!node.childCount &&
      !!node.firstChild &&
      node.firstChild.type === listItem,
  );
  if (!range) {
    return false;
  }

  // get the index of the selected list item in the list it is part of
  const startIndex = range.startIndex;
  if (startIndex === 0) {
    return false;
  }

  // get the parent list of the list item(s) in the selected range
  const parent = range.parent;

  // get the list immediately before the selection start
  const previousListItem = parent.child(startIndex - 1);
  if (previousListItem.type !== listItem) {
    return false;
  }

  // if that list was nested, join the selected list items into the same
  // nested list; if not, create a new child list of the same type and
  // nest it under the current level
  const isPreviousListNested =
    previousListItem.lastChild &&
    ['bulletList', 'orderedList'].includes(
      previousListItem.lastChild.type.name,
    );
  const inner = Fragment.from(
    isPreviousListNested ? listItem.create() : undefined,
  );
  const nextListNodeType = isPreviousListNested
    ? previousListItem!.lastChild!.type
    : parent.type;
  const nextListNodeContent = Fragment.from(
    nextListNodeType.create(null, inner),
  );
  const slice = new Slice(
    Fragment.from(listItem.create(null, nextListNodeContent)),
    isPreviousListNested ? 3 : 1,
    0,
  );
  const before = range.start;
  const after = range.end;

  tr.step(
    new ReplaceAroundStep(
      before - (isPreviousListNested ? 3 : 1),
      after,
      before,
      after,
      slice,
      1,
      true,
    ),
  );
};
