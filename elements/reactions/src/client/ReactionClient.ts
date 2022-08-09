import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';

export type ReactionRequest<T> = (
  containerAri: string,
  ari: string,
  emojiId: string,
  metadata?: { [k: string]: any },
) => Promise<T>;

/**
 * Collection of methods to interact with the reactions API
 */
export interface ReactionClient {
  /**
   * Fetch list of reactions for a given ARI.
   * @param containerAri Key identifer for the container wrapper (JIRA ticket, JIRA issue, Connfluence page, etc.)
   * @param aris collection of Asset ids in the container (JIRA issue, Connfluence page, etc.)
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
