import { Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export type DecorationTransformer = ({
  decorationSet,
  tr,
}: {
  decorationSet: DecorationSet;
  tr: Transaction;
}) => DecorationSet;
