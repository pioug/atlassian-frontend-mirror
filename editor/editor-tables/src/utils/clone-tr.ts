import { type Transaction } from '@atlaskit/editor-prosemirror/state';

// Creates a new transaction object from a given transaction
export const cloneTr = (tr: Transaction): Transaction =>
	Object.assign(Object.create(tr), tr).setTime(Date.now());
