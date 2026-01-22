import { isConfluenceGenerator } from '@atlaskit/link-extractors';

import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

/**
 * Computes the relevant icon for a document type.
 *
 * @remark Note that document icons can vary based on the provider. E.g., a
 * provider may choose to re-use one of these document types in their domain,
 * but offer a different SVG icon on the frontend (to map to this type in their
 * domain). See `schema:digitalDocument` for an example of this behaviour. This
 * mechanism will be superseded by backend-driven icon URLs as part of
 * go/j/MODES-5864. Do not add more!
 *
 * @param documentType JSON-LD document type
 * @param label human-readable label to be displayed on the icon
 * @param providerId JSON-LD provider (generator ID)
 * @returns an icon descriptor representing the document type
 */
const extractDocumentTypeIcon = (
	documentType: string,
	label?: string,
	providerId?: string,
): IconDescriptor | undefined => {
	switch (documentType) {
		case 'schema:BlogPosting':
			return {
						icon: IconType.Blog,
						label
					};
		case 'schema:DigitalDocument':
			if (providerId && isConfluenceGenerator(providerId)) {
				return {
							icon: IconType.LiveDocument,
							label
						};
			} else {
				return {
							icon: IconType.File,
							label
						};
			}
		case 'schema:TextDigitalDocument':
			return {
						icon: IconType.Document,
						label
					};
		case 'schema:PresentationDigitalDocument':
			return {
						icon: IconType.Presentation,
						label
					};
		case 'schema:SpreadsheetDigitalDocument':
			return {
						icon: IconType.Spreadsheet,
						label
					};
		case 'atlassian:Template':
			return {
						icon: IconType.Template,
						label
					};
		case 'atlassian:UndefinedLink':
			return {
						icon: IconType.Document,
						label
					};
		default:
			return undefined;
	}
};

export default extractDocumentTypeIcon;
