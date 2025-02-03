/**
 * Options required to prioritise which icon to show
 */
export type IconPriorityOpts<T> = {
	/**
	 * Icon choice corresponding to the file format (based on MIME type) for the object.
	 */
	fileFormatIcon: T | undefined;
	/**
	 * Icon choice corresponding to the document type for the object.
	 * @remark Document type icons can be provider-specific. This covers use cases
	 * where a document type + provider combo is necessary to offer a unique icon
	 * for a type. Example: Live document icons for Confluence (`schema:digitalDocument`).
	 * This mechanism will be superseded by backend-driven icon URLs as part of
	 * go/j/MODES-5864. Do not add more!
	 */
	documentTypeIcon: T | undefined;
	/**
	 * The icon choice extracted from the icon property of the JSON-LD data object.
	 */
	urlIcon: T | undefined;
	/**
	 * The icon choice extracted from the generator object (provider) of the
	 * JSON-LD data object.
	 */
	providerIcon: T | undefined;
};

/**
 * Reusable priority function for choosing which icon to show.
 * Generic so it can be used to prioritise strings, or React components depending on the usage.
 */
export function prioritiseIcon<T>({
	fileFormatIcon,
	documentTypeIcon,
	urlIcon,
	providerIcon,
}: IconPriorityOpts<T>): T | undefined {
	return urlIcon || fileFormatIcon || documentTypeIcon || providerIcon;
}
