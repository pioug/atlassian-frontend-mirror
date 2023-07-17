// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import { ReadonlyTransaction, Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export type DecorationTransformer = ({
  decorationSet,
  tr,
}: {
  decorationSet: DecorationSet;
  tr: Transaction | ReadonlyTransaction;
}) => DecorationSet;
