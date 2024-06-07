export interface User {
	/**
	 * user id in system
	 */
	id: string;
	/**
	 * name of user clicked on the reaction
	 */
	displayName: string;
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
