import { Transaction } from 'prosemirror-state';

export type ApplyChangeHandler = (tr: Transaction) => Transaction;
export type { ContextPanelHandler } from '@atlaskit/editor-common/types';
