import { Transaction } from '@atlaskit/editor-prosemirror/state';

export type ApplyChangeHandler = (tr: Transaction) => Transaction;
export type { ContextPanelHandler } from '@atlaskit/editor-common/types';
