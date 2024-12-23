import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type EditorCommand = (props: { tr: Transaction }) => Transaction | null;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EditorCommandWithMetadata = (...args: any) => EditorCommand;
