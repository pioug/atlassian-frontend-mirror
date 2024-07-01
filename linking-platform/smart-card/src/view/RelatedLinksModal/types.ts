export type RelatedLinksModalProps = {
	/**
	 * ari for which the related links will be derived from
	 */
	ari: string;
	/**
	 * Function to be called when the modal is closed
	 */
	onClose: () => void;
	/**
	 * Prop which controls whether the modal is shown
	 */
	showModal: boolean;
};
