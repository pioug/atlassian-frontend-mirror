import { User } from './User';

export interface DetailedReaction {
  ari: string;
  emojiId: string;
  count: number;
  users: User[];
}
