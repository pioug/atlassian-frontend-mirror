import { type ReactionUpdateFailure, type ReactionUpdateSuccess } from './reaction';

/**
 * Event callback by the client to the API
 * @param containerAri the container for reactions/ari in the page (attached to the "quickReactionEmojis" prop)
 * @param ariunique Atlassian identifier for an emoji (attached to the "quickReactionEmojis" prop)
 * @param emojiId unique identifier guid for the emoji
 * @param onSuccess (Optional) callback invoked when the reaction update succeeds
 * @param onFailure (Optional) callback invoked when the reaction update fails
 */
export type ReactionAction = (
	containerAri: string,
	ari: string,
	emojiId: string,
	onSuccess?: ReactionUpdateSuccess,
	onFailure?: ReactionUpdateFailure,
) => void;

export type Actions = {
	/**
	 * Add a new reation api
	 */
	addReaction: ReactionAction;
	/**
	 * Hover an existing reaction emoji api
	 */
	getDetailedReaction: ReactionAction;
	/**
	 * Retrieve reaction collection api
	 * @param containerId the container for reactions/ari in the page
	 * @param aris collection of Asset ids in the container
	 */
	getReactions: (containerId: string, aris: string) => void;
	/**
	 * Select/deselect a rection callback
	 */
	toggleReaction: ReactionAction;
};
