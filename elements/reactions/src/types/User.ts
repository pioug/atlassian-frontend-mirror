export interface User {
	accountId?: string;
	/** Agent identity for a reaction made with a person. */
	agent?: {
		name: string;
		avatarUrl?: string;
		identityAccountId?: string;
	};
	/**
	 * name of user clicked on the reaction
	 */
	displayName: string;
	/**
	 * user id in system
	 */
	id: string;
	/**
	 * optional path to a user profile picture
	 */
	profilePicture?: ProfilePicture;
}

/**
 * Type defining the path to a user profile picture
 */
export type ProfilePicture = {
	path: string;
};
