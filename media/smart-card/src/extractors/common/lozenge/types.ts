export type LinkLozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';

export interface LinkLozenge {
  text: string;
  appearance?: LinkLozengeColor;
}

export type LinkPullRequestState = 'open' | 'merged' | 'declined' | 'closed';
