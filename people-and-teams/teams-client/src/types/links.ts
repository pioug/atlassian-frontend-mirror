/**
 * Used to synchronise these field names to forms used to create/edit links e.g. TeamLinkForm
 */
export const LINK_FIELDS = {
	CONTENT_TITLE: 'contentTitle' as const,
	DESCRIPTION: 'description' as const,
	LINK_URI: 'linkUri' as const,
};

export interface TeamLink {
	[LINK_FIELDS.CONTENT_TITLE]: string;
	[LINK_FIELDS.DESCRIPTION]: string;
	[LINK_FIELDS.LINK_URI]: string;
	/**
	 * @private
	 * @deprecated field has been removed as part of migration to V4
	 */
	creationTime?: string;
	linkId: string;
	teamId?: string;
}

/**
 * Type for uncreated team links. These don't have link IDs
 */
export type NewTeamLink = Omit<TeamLink, 'linkId'>;

/**
 * Type for order of team links.
 */
export type LinkOrder = {
	teamId: string;
	linkOrder: string[];
};
