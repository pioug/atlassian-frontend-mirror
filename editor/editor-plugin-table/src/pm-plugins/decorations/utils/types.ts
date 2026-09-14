import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type DecorationTransformer = (params: DecorationTransformerParams) => DecorationSet;

export type DecorationTransformerParams = {
	decorationSet: DecorationSet;
	tr: Transaction | ReadonlyTransaction;
};
