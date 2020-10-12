import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';

export type ReactionRequest<T> = (
  containerAri: string,
  ari: string,
  emojiId: string,
) => Promise<T>;

export interface ReactionClient {
  getReactions(containerAri: string, aris: string[]): Promise<Reactions>;
  getDetailedReaction: ReactionRequest<ReactionSummary>;
  addReaction: ReactionRequest<ReactionSummary[]>;
  deleteReaction: ReactionRequest<ReactionSummary[]>;
}
