import { DecorationSet } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';

export type DecorationSetBuilder = ({
  decorationSet,
  tr,
}: {
  decorationSet: DecorationSet;
  tr: Transaction;
}) => DecorationSet;
