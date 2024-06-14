export type RelatedLinksModalProps = {
	/* url for which the related links will be derived from */
	url: string;
	/* Function to be called when the modal is closed */
	onClose: () => void;
	/* Prop which controls whether the modal is shown */
	showModal: boolean;
};
