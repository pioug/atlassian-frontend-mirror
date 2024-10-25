import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

const extractDocumentTypeIcon = (
	documentType: string,
	label?: string,
): IconDescriptor | undefined => {
	switch (documentType) {
		case 'schema:BlogPosting':
			return { icon: IconType.Blog, label: label || 'Blog' };
		case 'schema:DigitalDocument':
			return { icon: IconType.File, label: label || 'File' };
		case 'schema:TextDigitalDocument':
			return { icon: IconType.Document, label: label || 'Document' };
		case 'schema:PresentationDigitalDocument':
			return { icon: IconType.Presentation, label: label || 'Presentation' };
		case 'schema:SpreadsheetDigitalDocument':
			return { icon: IconType.Spreadsheet, label: label || 'Spreadsheet' };
		case 'atlassian:Template':
			return { icon: IconType.Template, label: label || 'Template' };
		case 'atlassian:UndefinedLink':
			return { icon: IconType.Document, label: label || 'Undefined link' };
		default:
			return undefined;
	}
};

export default extractDocumentTypeIcon;
