export interface User {
	accountId?: string;
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
