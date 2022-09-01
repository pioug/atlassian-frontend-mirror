import { User } from './User';

/**
 * Collection of reactions as object (key is unique id from containerAri and ari combined)
 */
export type Reactions = Record<string, ReactionSummary[]>;

/**
 * MetaData for Reaction object
 */
export interface ReactionSummary {
  /**
   * Reaction Asset id in the container
   */
  ari: string;
  /**
   * the container for reactions/ari in the page
   */
  containerAri: string;
  /**
   * unique Atlassian identifier for an emoji
   */
  emojiId: string;
  /**
   * Number of selected count for the emoji
   */
  count: number;
  /**
   * Has the current user selected the emoji or not
   */
  reacted: boolean;
  /**
   * Users collection
   */
  users?: User[];
  /**
   * @deprecated Legacy content Not in use anymore
   */
  optimisticallyUpdated?: boolean;
}

/**
 * Event handler for when the user clicks on the reaction
 * @param id give id for the emoji
 * @param event selected mouse event proerties
 */
export type ReactionClick = (
  id: string,
  event: React.MouseEvent<HTMLButtonElement>,
) => void;

/**
 * Event handler for when the user hovers with the mouse on the reaction
 * @param reaction reaction object
 * @param event (Optional) custom DOM event handler callback
 */
export type ReactionMouseEnter = (
  reaction: ReactionSummary,
  event?: React.MouseEvent<any>,
) => void;

/**
 * Condition of the reaction when gets loaded from the store
 */
export enum ReactionStatus {
  ready = 'READY',
  loading = 'LOADING',
  error = 'ERROR',
  notLoaded = 'NOT_LOADED',
}

/**
 * state in which the reaction is at
 */
export type ReactionsState =
  | ReactionsNotLoaded
  | ReactionsLoading
  | ReactionsReadyState
  | ReactionsError;

export type ReactionsReadyState = {
  readonly status: ReactionStatus.ready;
  readonly reactions: ReactionSummary[];
};

export type ReactionsLoading = {
  readonly status: ReactionStatus.loading;
};

export type ReactionsError = {
  readonly status: ReactionStatus.error;
  readonly message: string;
};

export type ReactionsNotLoaded = {
  readonly status: ReactionStatus.notLoaded;
};

/**
 * Source where the emoji selected from ("quickSelector" -> default list, "emojiPicker" -> custom emoji list)
 */
export type ReactionSource = 'quickSelector' | 'emojiPicker';
