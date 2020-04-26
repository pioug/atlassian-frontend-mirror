import { DecorationSet } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';

export type DecorationTransformer = ({
  decorationSet,
  tr,
}: {
  decorationSet: DecorationSet;
  tr: Transaction;
}) => DecorationSet;
