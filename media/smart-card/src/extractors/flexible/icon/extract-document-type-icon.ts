import { IconDescriptor } from './types';
import { IconType } from '../../../constants';

const extractDocumentTypeIcon = (
  documentType: string,
  label?: string,
): IconDescriptor | undefined => {
  switch (documentType) {
    case 'schema:BlogPosting':
      return [IconType.Blog, label || 'Blog'];
    case 'schema:DigitalDocument':
      return [IconType.File, label || 'File'];
    case 'schema:TextDigitalDocument':
      return [IconType.Document, label || 'Document'];
    case 'schema:PresentationDigitalDocument':
      return [IconType.Presentation, label || 'Presentation'];
    case 'schema:SpreadsheetDigitalDocument':
      return [IconType.Spreadsheet, label || 'Spreadsheet'];
    case 'atlassian:Template':
      return [IconType.Template, label || 'Template'];
    case 'atlassian:UndefinedLink':
      return [IconType.Document, label || 'Undefined link'];
    default:
      return undefined;
  }
};

export default extractDocumentTypeIcon;
