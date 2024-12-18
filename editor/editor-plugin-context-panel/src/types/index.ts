import { type Transaction } from '@atlaskit/editor-prosemirror/state';

export type ApplyChangeHandler = (tr: Transaction) => Transaction;
