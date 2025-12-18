import { isConfluenceGenerator } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

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
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Blog,
						label
					}
				: {
						icon: IconType.Blog,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Blog',
					};
		case 'schema:DigitalDocument':
			if (providerId && isConfluenceGenerator(providerId)) {
				return fg('navx-2827-eslint-object-translation-smart-links')
					? {
							icon: IconType.LiveDocument,
							label
						}
					: {
							icon: IconType.LiveDocument,
							// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
							label: label || 'Live Document',
						};
			} else {
				return fg('navx-2827-eslint-object-translation-smart-links')
					? {
							icon: IconType.File,
							label
						}
					: {
							icon: IconType.File,
							// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
							label: label || 'File',
						};
			}
		case 'schema:TextDigitalDocument':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Document,
						label
					}
				: {
						icon: IconType.Document,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Document',
					};
		case 'schema:PresentationDigitalDocument':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Presentation,
						label
					}
				: {
						icon: IconType.Presentation,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Presentation',
					};
		case 'schema:SpreadsheetDigitalDocument':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Spreadsheet,
						label
					}
				: {
						icon: IconType.Spreadsheet,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Spreadsheet',
					};
		case 'atlassian:Template':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Template,
						label
					}
				: {
						icon: IconType.Template,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Template',
					};
		case 'atlassian:UndefinedLink':
			return fg('navx-2827-eslint-object-translation-smart-links')
				? {
						icon: IconType.Document,
						label
					}
				: {
						icon: IconType.Document,
						// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
						label: label || 'Undefined link',
					};
		default:
			return undefined;
	}
};

export default extractDocumentTypeIcon;
