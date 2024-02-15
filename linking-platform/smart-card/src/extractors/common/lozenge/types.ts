import { InvokeActions } from '../../../state/hooks/use-invoke/types';

export type LinkLozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';

export type LinkLozengeInvokeActions = InvokeActions;

export interface LinkLozenge {
  action?: LinkLozengeInvokeActions;
  text: string;
  appearance?: LinkLozengeColor;
}

export type LinkDocumentState = 'archived' | 'draft' | 'current';
export type LinkPullRequestState = 'open' | 'merged' | 'declined' | 'closed';

export type LinkState = LinkDocumentState & LinkPullRequestState;
