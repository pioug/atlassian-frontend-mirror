export type RelatedLinksModalProps = {
	/**
	 * ari for which the related links will be derived from
	 */
	ari: string;
	/**
	 * base url which will be appended with /gateway/api/graphql to make requests to AGG
	 * to retrieve related ARIs for the given ari using content-referenced-entity relationship
	 */
	baseUriWithNoTrailingSlash?: string;
	/**
	 * Function to be called when the modal is closed
	 */
	onClose: () => void;

	/**
	 * Prop which controls whether the modal is shown
	 */
	showModal: boolean;
};
