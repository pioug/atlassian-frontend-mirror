import { render, screen } from '@testing-library/react';

import { isConfluenceGenerator } from '@atlaskit/link-extractors';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { TEST_URL } from '../../__mocks__/jsonld';
import { withIntl } from '../../__mocks__/withIntl';
import { extractIconFromDocument } from '../extractIconFromDocument';

jest.mock('@atlaskit/link-extractors');

beforeEach(() => {
	jest.mocked(isConfluenceGenerator).mockReturnValue(false);
});

afterEach(jest.clearAllMocks);

describe('extractors.icon.document', () => {
	ffTest.both('platform_navx_smart_link_icon_label_a11y', 'document type icons', () => {
		it('should capture and report a11y violations', async () => {
			const icon = extractIconFromDocument('schema:BlogPosting', { showIconLabel: true });
			const { container } = render(withIntl(icon));

			await expect(container).toBeAccessible();
		});

		it('returns blog icon for BlogPosting', async () => {
			const icon = extractIconFromDocument('schema:BlogPosting', { showIconLabel: true });
			render(withIntl(icon));
			expect(screen.getByTestId('blog-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'blog' })).toBeVisible();
		});

		it('returns file icon for DigitalDocument', async () => {
			const icon = extractIconFromDocument('schema:DigitalDocument', { showIconLabel: true });
			render(withIntl(icon));
			expect(screen.getByTestId('file-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'file' })).toBeVisible();
		});

		it('returns document icon for TextDigitalDocument', async () => {
			const icon = extractIconFromDocument('schema:TextDigitalDocument', { showIconLabel: true });
			render(withIntl(icon));
			expect(screen.getByTestId('document-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'document' })).toBeVisible();
		});

		it('returns document icon for UndefinedLink', async () => {
			const icon = extractIconFromDocument('atlassian:UndefinedLink', { showIconLabel: true });
			render(withIntl(icon));
			expect(screen.getByTestId('document-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'document' })).toBeVisible();
		});

		it('returns presentation icon for PresentationDigitalDocument', async () => {
			const icon = extractIconFromDocument('schema:PresentationDigitalDocument', {
				showIconLabel: true,
			});
			render(withIntl(icon));
			expect(screen.getByTestId('presentation-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'presentation' })).toBeVisible();
		});

		it('returns spreadsheet icon for SpreadsheetDigitalDocument', async () => {
			const icon = extractIconFromDocument('schema:SpreadsheetDigitalDocument', {
				showIconLabel: true,
			});
			render(withIntl(icon));
			expect(screen.getByTestId('spreadsheet-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'spreadsheet' })).toBeVisible();
		});

		it('returns document filled icon for Template', async () => {
			const icon = extractIconFromDocument('atlassian:Template', { showIconLabel: true });
			render(withIntl(icon));
			expect(screen.getByTestId('document-filled-icon')).toBeVisible();
			expect(screen.getByRole('img', { name: 'template' })).toBeVisible();
		});
	});

	ffTest.on('platform_navx_smart_link_icon_label_a11y', 'file format icon exposes label', () => {
		it('privileges file mime type icon for other documents', async () => {
			const icon = extractIconFromDocument('Document', {
				fileFormat: 'image/png',
				showIconLabel: true,
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
			expect(await screen.findByRole('img', { name: 'image' })).toBeVisible();
		});

		it('privileges fileFormat icon for other documents', async () => {
			const icon = extractIconFromDocument('Document', {
				fileFormat: 'image/png',
				provider: { icon: TEST_URL, text: 'favicon' },
				showIconLabel: true,
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
			expect(await screen.findByRole('img', { name: 'image' })).toBeVisible();
		});

		it('privileges provider icon if specified as priority', async () => {
			const icon = extractIconFromDocument('schema:BlogPosting', {
				fileFormat: 'image/png',
				provider: { icon: TEST_URL, text: 'favicon' },
				priority: 'provider',
				showIconLabel: true,
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
			expect(await screen.findByRole('img', { name: 'image' })).toBeVisible();
		});
	});

	ffTest.off(
		'platform_navx_smart_link_icon_label_a11y',
		'file format icon omits label prop',
		() => {
			it('privileges file mime type icon for other documents', async () => {
				const icon = extractIconFromDocument('Document', {
					fileFormat: 'image/png',
					showIconLabel: true,
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
				expect(screen.queryByRole('img', { name: 'image' })).not.toBeInTheDocument();
			});

			it('privileges fileFormat icon for other documents', async () => {
				const icon = extractIconFromDocument('Document', {
					fileFormat: 'image/png',
					provider: { icon: TEST_URL, text: 'favicon' },
					showIconLabel: true,
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
				expect(screen.queryByRole('img', { name: 'image' })).not.toBeInTheDocument();
			});

			it('privileges provider icon if specified as priority', async () => {
				const icon = extractIconFromDocument('schema:BlogPosting', {
					fileFormat: 'image/png',
					provider: { icon: TEST_URL, text: 'favicon' },
					priority: 'provider',
					showIconLabel: true,
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
				expect(screen.queryByRole('img', { name: 'image' })).not.toBeInTheDocument();
			});
		},
	);
});

describe('provider-specific document icons', () => {
	ffTest.both(
		'platform_navx_smart_link_icon_label_a11y',
		'confluence and default digital document',
		() => {
			it('returns live doc icon for Confluence digital document', async () => {
				jest.mocked(isConfluenceGenerator).mockReturnValue(true);

				const icon = extractIconFromDocument('schema:DigitalDocument', {
					showIconLabel: true,
					provider: { id: 'confluence', text: 'Confluence' },
				});
				render(withIntl(icon));
				expect(screen.getByTestId('live-doc-icon')).toBeVisible();
				expect(screen.getByRole('img', { name: 'live document' })).toBeVisible();
			});

			it('returns document icon as default (no provider match)', async () => {
				const icon = extractIconFromDocument('schema:DigitalDocument', {
					showIconLabel: true,
					provider: { id: 'jims-gym', text: 'Jims Gym' },
				});
				render(withIntl(icon));
				expect(screen.getByTestId('file-icon')).toBeVisible();
				expect(screen.getByRole('img', { name: 'file' })).toBeVisible();
			});
		},
	);
});
