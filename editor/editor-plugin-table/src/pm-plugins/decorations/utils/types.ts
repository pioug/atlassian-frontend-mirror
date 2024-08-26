// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type DecorationTransformer = (params: DecorationTransformerParams) => DecorationSet;

type DecorationTransformerParams = {
	decorationSet: DecorationSet;
	tr: Transaction | ReadonlyTransaction;
};

export type BuildDecorationTransformerParams = DecorationTransformerParams & {
	options: {
		isDragAndDropEnabled: boolean;
	};
};
