import { User } from './User';

export interface ReactionSummary {
  ari: string;
  containerAri: string;
  emojiId: string;
  count: number;
  reacted: boolean;
  users?: User[];
  optimisticallyUpdated?: boolean;
}
