/**
 * Event callback by the client to the API
 * @param containerAri the container for reactions/ari in the page (attached to the "quickReactionEmojis" prop)
 * @param ariunique Atlassian identifier for an emoji (attached to the "quickReactionEmojis" prop)
 * @param emojiId unique identifier guid for the emoji
 */
export type ReactionAction = (containerAri: string, ari: string, emojiId: string) => void;

export type Actions = {
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
	/**
	 * Add a new reation api
	 */
	addReaction: ReactionAction;
	/**
	 * Hover an existing reaction emoji api
	 */
	getDetailedReaction: ReactionAction;
};
