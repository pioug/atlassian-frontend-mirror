import { Dispatch } from '../../../event-dispatcher';
import { Transaction } from 'prosemirror-state';

export type AlignmentState = 'start' | 'end' | 'center';
export type AlignmentPluginState = {
  align: AlignmentState;
  isEnabled?: boolean;
};
export type ActionHandlerParams = {
  dispatch: Dispatch;
  pluginState: AlignmentPluginState;
  tr: Transaction;
  params?: {
    align?: string;
    disabled?: boolean;
  };
};
