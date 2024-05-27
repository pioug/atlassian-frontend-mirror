import { type Reactions, type ReactionSummary } from './reaction';

export type Request<T> = (
  /**
   * Reaction Asset id in the container
   */
  ari: string,
  /**
   * the container for reactions/ari
   */
  containerAri: string,
  /**
   * unique Atlassian identifier for an emoji
   */
  emojiId: string,
  /**
   * Optional metadata information used in the API request
   */
  metadata?: Record<string, any>,
) => Promise<T>;

export interface Client {
  /**
   * fetch reactions request handler
   * @param containerAri container wrapper id
   * @param aris container reaction assets unique ids
   */
  getReactions(containerAri: string, aris: string[]): Promise<Reactions>;
  /**
   * Fetch details for a given reaction.
   */
  getDetailedReaction: Request<ReactionSummary>;
  /**
   * Fetch request when adding a reaction to a container.
   */
  addReaction: Request<ReactionSummary[]>;
  /**
   * Fetch request when removing a reaction from a container.
   */
  deleteReaction: Request<ReactionSummary[]>;
}
