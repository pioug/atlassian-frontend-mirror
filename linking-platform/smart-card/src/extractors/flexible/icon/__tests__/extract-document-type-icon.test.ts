import type { JsonLd } from '@atlaskit/json-ld-types';
import { isConfluenceGenerator } from '@atlaskit/link-extractors';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { IconType } from '../../../../constants';
import extractDocumentTypeIcon from '../extract-document-type-icon';

jest.mock('@atlaskit/link-extractors');

beforeEach(() => {
	jest.mocked(isConfluenceGenerator).mockReturnValue(false);
});

afterEach(jest.clearAllMocks);

describe('extractDocumentTypeIcon', () => {
	ffTest.on('platform_navx_smart_link_icon_label_a11y', 'semantic labels when flag is on', () => {
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

			const iconDescriptor = extractDocumentTypeIcon(
				'schema:DigitalDocument',
				undefined,
				'confluence',
			);
			expect(iconDescriptor).toEqual({ icon: IconType.LiveDocument, label: 'live document' });
		});

		it('returns file icon by default', () => {
			jest.mocked(isConfluenceGenerator).mockReturnValue(true);

			const iconDescriptor = extractDocumentTypeIcon('schema:DigitalDocument');
			expect(iconDescriptor).toEqual({ icon: IconType.File, label: 'file' });
		});
	});

	ffTest.off(
		'platform_navx_smart_link_icon_label_a11y',
		'no semantic label when title omitted (legacy)',
		() => {
			describe.each<[string, JsonLd.Primitives.ObjectType | 'atlassian:Template', IconType]>([
				['blog', 'schema:BlogPosting', IconType.Blog],
				['file', 'schema:DigitalDocument', IconType.File],
				['document', 'schema:TextDigitalDocument', IconType.Document],
				['presentation', 'schema:PresentationDigitalDocument', IconType.Presentation],
				['spreadsheet', 'schema:SpreadsheetDigitalDocument', IconType.Spreadsheet],
				['template', 'atlassian:Template', IconType.Template],
				['presentation', 'schema:PresentationDigitalDocument', IconType.Presentation],
				['document', 'atlassian:UndefinedLink', IconType.Document],
			])('%s icon', (_, documentType, expectedIconType) => {
				it(`returns ${expectedIconType} with default label`, () => {
					const { icon } = extractDocumentTypeIcon(documentType) || {};

					expect(icon).toEqual(expectedIconType);
				});

				it(`returns ${expectedIconType} with custom label`, () => {
					const customLabel = 'custom-label';
					const { icon, label } = extractDocumentTypeIcon(documentType, customLabel) || {};

					expect(icon).toEqual(expectedIconType);
					expect(label).toEqual(customLabel);
				});
			});

			it('returns live document icon when provider is confluence', () => {
				jest.mocked(isConfluenceGenerator).mockReturnValue(true);

				const iconDescriptor = extractDocumentTypeIcon('schema:DigitalDocument', '', 'confluence');
				expect(iconDescriptor).toEqual({ icon: IconType.LiveDocument, label: '' });
			});

			it('returns file icon by default', () => {
				jest.mocked(isConfluenceGenerator).mockReturnValue(true);

				const iconDescriptor = extractDocumentTypeIcon('schema:DigitalDocument', '');
				expect(iconDescriptor).toEqual({ icon: IconType.File, label: '' });
			});
		},
	);

	it('returns undefined if document type does not match', () => {
		const iconDescriptor = extractDocumentTypeIcon('random' as any);

		expect(iconDescriptor).toBeUndefined();
	});

	ffTest.on(
		'platform_navx_smart_link_icon_label_a11y',
		'semantic label when title also passed',
		() => {
			it('prefers semantic label over title when flag is on', () => {
				const iconDescriptor = extractDocumentTypeIcon('schema:BlogPosting', 'My doc title');
				expect(iconDescriptor).toEqual({ icon: IconType.Blog, label: 'blog' });
			});
		},
	);

	ffTest.off(
		'platform_navx_smart_link_icon_label_a11y',
		'uses label param when flag is off',
		() => {
			it('uses title for label when flag is off and title is provided', () => {
				const iconDescriptor = extractDocumentTypeIcon('schema:BlogPosting', 'My doc title');
				expect(iconDescriptor).toEqual({ icon: IconType.Blog, label: 'My doc title' });
			});
		},
	);
});
