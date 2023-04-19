import { InvokeActions } from '../../../state/hooks/use-invoke/types';

export type LinkLozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';

export interface LinkLozenge {
  action?: InvokeActions;
  text: string;
  appearance?: LinkLozengeColor;
}

export type LinkDocumentState = 'archived' | 'draft' | 'current';
export type LinkPullRequestState = 'open' | 'merged' | 'declined' | 'closed';

export type LinkState = LinkDocumentState & LinkPullRequestState;
