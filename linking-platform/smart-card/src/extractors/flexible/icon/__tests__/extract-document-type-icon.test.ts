import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { isConfluenceGenerator } from '@atlaskit/link-extractors/is-confluence-generator';

import { IconType } from '../../../../constants';
import extractDocumentTypeIcon from '../extract-document-type-icon';

jest.mock('@atlaskit/link-extractors/is-confluence-generator');

beforeEach(() => {
	jest.mocked(isConfluenceGenerator).mockReturnValue(false);
});

afterEach(jest.clearAllMocks);

describe('extractDocumentTypeIcon', () => {
	describe('semantic labels when flag is on', () => {
		describe.each<[string, JsonLd.Primitives.ObjectType | 'atlassian:Template', IconType, string]>([
			['blog', 'schema:BlogPosting', IconType.Blog, 'blog'],
			['file', 'schema:DigitalDocument', IconType.File, 'file'],
			['document', 'schema:TextDigitalDocument', IconType.Document, 'document'],
			['presentation', 'schema:PresentationDigitalDocument', IconType.Presentation, 'presentation'],
			['spreadsheet', 'schema:SpreadsheetDigitalDocument', IconType.Spreadsheet, 'spreadsheet'],
			['template', 'atlassian:Template', IconType.Template, 'template'],
			['presentation', 'schema:PresentationDigitalDocument', IconType.Presentation, 'presentation'],
			['document', 'atlassian:UndefinedLink', IconType.Document, 'document'],
		])('%s icon', (_, documentType, expectedIconType, expectedLabel) => {
			it(`returns ${expectedIconType} with semantic label`, () => {
				const { icon, label } = extractDocumentTypeIcon(documentType) || {};

				expect(icon).toEqual(expectedIconType);
				expect(label).toEqual(expectedLabel);
			});
		});

		it('returns live document icon when provider is confluence', () => {
			jest.mocked(isConfluenceGenerator).mockReturnValue(true);

			const iconDescriptor = extractDocumentTypeIcon('schema:DigitalDocument', 'confluence');
			expect(iconDescriptor).toEqual({ icon: IconType.LiveDocument, label: 'live document' });
		});

		it('returns file icon by default', () => {
			jest.mocked(isConfluenceGenerator).mockReturnValue(true);

			const iconDescriptor = extractDocumentTypeIcon('schema:DigitalDocument');
			expect(iconDescriptor).toEqual({ icon: IconType.File, label: 'file' });
		});
	});

	it('returns undefined if document type does not match', () => {
		const iconDescriptor = extractDocumentTypeIcon('random' as any);

		expect(iconDescriptor).toBeUndefined();
	});

	it('prefers semantic label over title when flag is on', () => {
		const iconDescriptor = extractDocumentTypeIcon('schema:BlogPosting', 'My doc title');
		expect(iconDescriptor).toEqual({ icon: IconType.Blog, label: 'blog' });
	});
});
