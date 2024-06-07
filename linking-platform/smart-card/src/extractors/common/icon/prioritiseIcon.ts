import { type IconType } from '../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../constants';

const isConfluenceProvider = (provider?: string) => provider === CONFLUENCE_GENERATOR_ID;

const isJiraProvider = (provider?: string) => provider === JIRA_GENERATOR_ID;

const isNativeProvider = (provider?: string) =>
	isConfluenceProvider(provider) || isJiraProvider(provider);

/**
 * Represents an icon. Should either contain a label and url, or a an icon type and label.
 */
export type IconDescriptor = {
	icon?: IconType;
	label?: string;
	url?: string;
};

/**
 * Options required to prioritise which icon to show
 */
export type IconPriorityOpts<T> = {
	/**
	 * The '@id' field of the JSON-LD generator object
	 */
	providerId: string | undefined;
	/**
	 * Icon choice corresponding to the file format (based on MIME type) for the object.
	 */
	fileFormatIcon: T | undefined;
	/**
	 * Icon choice corresponding to the document type for the object.
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
	providerId,
	fileFormatIcon,
	documentTypeIcon,
	urlIcon,
	providerIcon,
}: IconPriorityOpts<T>): T | undefined {
	if (isNativeProvider(providerId)) {
		return fileFormatIcon || documentTypeIcon || urlIcon || providerIcon;
	}
	return urlIcon || fileFormatIcon || documentTypeIcon || providerIcon;
}
