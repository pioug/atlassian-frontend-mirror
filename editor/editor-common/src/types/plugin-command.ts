import type { Transaction } from '@atlaskit/editor-prosemirror/state';

type PluginCommandProps = {
  tr: Transaction;
};

export type PluginCommand = (props: PluginCommandProps) => Transaction | null;
export type PluginCommandWithMetadata = (args: any) => PluginCommand;
