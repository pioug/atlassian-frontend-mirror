import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type EditorCommand = (props: { tr: Transaction }) => Transaction | null;
export type EditorCommandWithMetadata = (args: any) => EditorCommand;
