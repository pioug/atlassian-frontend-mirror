import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { isConfluenceGenerator } from '@atlaskit/link-extractors/is-confluence-generator';

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
 * @param providerId JSON-LD provider (generator ID)
 * @returns an icon descriptor representing the document type
 */
const extractDocumentTypeIcon = (
	documentType: JsonLd.Primitives.ObjectType | 'atlassian:Template',
	providerId?: string,
): IconDescriptor | undefined => {
	const getIconDescriptor = (icon: IconType, label: string): IconDescriptor => ({ icon, label });
	switch (documentType) {
		case 'schema:BlogPosting':
			return getIconDescriptor(IconType.Blog, 'blog');
		case 'schema:DigitalDocument':
			if (providerId && isConfluenceGenerator(providerId)) {
				return getIconDescriptor(IconType.LiveDocument, 'live document');
			} else {
				return getIconDescriptor(IconType.File, 'file');
			}
		case 'schema:TextDigitalDocument':
			return getIconDescriptor(IconType.Document, 'document');
		case 'schema:PresentationDigitalDocument':
			return getIconDescriptor(IconType.Presentation, 'presentation');
		case 'schema:SpreadsheetDigitalDocument':
			return getIconDescriptor(IconType.Spreadsheet, 'spreadsheet');
		case 'atlassian:Template':
			return getIconDescriptor(IconType.Template, 'template');
		case 'atlassian:UndefinedLink':
			return getIconDescriptor(IconType.Document, 'document');
		default:
			return undefined;
	}
};

export default extractDocumentTypeIcon;
