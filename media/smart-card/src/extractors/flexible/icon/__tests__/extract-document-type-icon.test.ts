import extractDocumentTypeIcon from '../extract-document-type-icon';
import { IconType } from '../../../../constants';

describe('extractDocumentTypeIcon', () => {
  describe.each([
    ['blog', 'schema:BlogPosting', IconType.Blog, 'Blog'],
    ['file', 'schema:DigitalDocument', IconType.File, 'File'],
    ['document', 'schema:TextDigitalDocument', IconType.Document, 'Document'],
    [
      'presentation',
      'schema:PresentationDigitalDocument',
      IconType.Presentation,
      'Presentation',
    ],
    [
      'spreadsheet',
      'schema:SpreadsheetDigitalDocument',
      IconType.Spreadsheet,
      'Spreadsheet',
    ],
    ['template', 'atlassian:Template', IconType.Template, 'Template'],
    [
      'presentation',
      'schema:PresentationDigitalDocument',
      IconType.Presentation,
      'Presentation',
    ],
    [
      'document',
      'atlassian:UndefinedLink',
      IconType.Document,
      'Undefined link',
    ],
  ])('%s icon', (_, documentType, expectedIconType, expectedLabel) => {
    it(`returns ${expectedIconType} with default label`, () => {
      const [iconType, label] = extractDocumentTypeIcon(documentType) || [];

      expect(iconType).toEqual(expectedIconType);
      expect(label).toEqual(expectedLabel);
    });

    it(`returns ${expectedIconType} with custom label`, () => {
      const customLabel = 'custom-label';
      const [iconType, label] =
        extractDocumentTypeIcon(documentType, customLabel) || [];

      expect(iconType).toEqual(expectedIconType);
      expect(label).toEqual(customLabel);
    });
  });

  it('returns undefined if document type does not match', () => {
    const iconDescriptor = extractDocumentTypeIcon('random');

    expect(iconDescriptor).toBeUndefined();
  });
});
