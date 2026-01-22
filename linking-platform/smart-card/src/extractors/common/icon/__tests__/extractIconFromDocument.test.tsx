import { render, screen } from '@testing-library/react';

import { isConfluenceGenerator } from '@atlaskit/link-extractors';

import { TEST_URL } from '../../__mocks__/jsonld';
import { withIntl } from '../../__mocks__/withIntl';
import { extractIconFromDocument } from '../extractIconFromDocument';

jest.mock('@atlaskit/link-extractors');

beforeEach(() => {
	jest.mocked(isConfluenceGenerator).mockReturnValue(false);
});

afterEach(jest.clearAllMocks);

describe('extractors.icon.document', () => {
	it('should capture and report a11y violations', async () => {
		const icon = extractIconFromDocument('schema:BlogPosting', {});
		const { container } = render(withIntl(icon));

		await expect(container).toBeAccessible();
	});

	it('returns blog icon for BlogPosting', async () => {
		const icon = extractIconFromDocument('schema:BlogPosting', { title: 'blog-icon' });
		render(withIntl(icon));
		expect(await screen.findByTestId('blog-icon')).toBeVisible();
	});

	it('returns file icon for DigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:DigitalDocument', { title: 'file-icon' });
		render(withIntl(icon));
		expect(await screen.findByTestId('file-icon')).toBeVisible();
	});

	it('returns document icon for TextDigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:TextDigitalDocument', { title: 'document-icon' });
		render(withIntl(icon));
		expect(await screen.findByTestId('document-icon')).toBeVisible();
	});

	it('returns document icon for UndefinedLink', async () => {
		const icon = extractIconFromDocument('atlassian:UndefinedLink', { title: 'document-icon' });
		render(withIntl(icon));
		expect(await screen.findByTestId('document-icon')).toBeVisible();
	});

	it('returns presentation icon for PresentationDigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:PresentationDigitalDocument', {
			title: 'presentation-icon',
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('presentation-icon')).toBeVisible();
	});

	it('returns spreadsheet icon for SpreadsheetDigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:SpreadsheetDigitalDocument', {
			title: 'spreadsheet-icon',
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('spreadsheet-icon')).toBeVisible();
	});

	it('returns document filled icon for Template', async () => {
		const icon = extractIconFromDocument('atlassian:Template', { title: 'document-filled-icon' });
		render(withIntl(icon));
		expect(await screen.findByTestId('document-filled-icon')).toBeVisible();
	});

	it('privileges file mime type icon for other documents', async () => {
		const icon = extractIconFromDocument('Document', {
			fileFormat: 'image/png',
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
	});

	it('privileges fileFormat icon for other documents', async () => {
		const icon = extractIconFromDocument('Document', {
			fileFormat: 'image/png',
			provider: { icon: TEST_URL, text: 'favicon' },
		});
		expect(icon).not.toBe(String);
		expect(icon).toBeDefined();
	});

	it('privileges provider icon if specified as priority', async () => {
		const icon = extractIconFromDocument('schema:BlogPosting', {
			fileFormat: 'image/png',
			provider: { icon: TEST_URL, text: 'favicon' },
			priority: 'provider',
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
	});
});

describe('provider-specific document icons', () => {
	it('returns live doc icon for Confluence digital document', async () => {
		jest.mocked(isConfluenceGenerator).mockReturnValue(true);

		const icon = extractIconFromDocument('schema:DigitalDocument', {
			provider: { id: 'confluence', text: 'Confluence' },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('live-doc-icon')).toBeVisible();
	});

	it('returns document icon as default (no provider match)', async () => {
		const icon = extractIconFromDocument('schema:DigitalDocument', {
			provider: { id: 'jims-gym', text: 'Jims Gym' },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('file-icon')).toBeVisible();
	});
});
