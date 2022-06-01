import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';

export type ReactionRequest<T> = (
  containerAri: string,
  ari: string,
  emojiId: string,
  metadata?: { [k: string]: any },
) => Promise<T>;

export interface ReactionClient {
  /**
   * Fetch list of reactions for a given ARI.
   * @param containerAri F
   * @param aris
   */
  getReactions(containerAri: string, aris: string[]): Promise<Reactions>;
  /**
   * Fetch details for a given reaction.
   */
  getDetailedReaction: ReactionRequest<ReactionSummary>;
  /**
   * Fetch request when adding a reaction to a container.
   */
  addReaction: ReactionRequest<ReactionSummary[]>;
  /**
   * Fetch request when removing a reaction from a container.
   */
  deleteReaction: ReactionRequest<ReactionSummary[]>;
}
