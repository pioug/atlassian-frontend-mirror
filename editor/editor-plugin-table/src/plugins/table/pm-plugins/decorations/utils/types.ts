// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import {
  ReadonlyTransaction,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type DecorationTransformer = ({
  decorationSet,
  tr,
}: {
  decorationSet: DecorationSet;
  tr: Transaction | ReadonlyTransaction;
}) => DecorationSet;
