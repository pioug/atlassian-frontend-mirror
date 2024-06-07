import { extractIconFromDocument } from '../extractIconFromDocument';
import { render, screen } from '@testing-library/react';
import { withIntl } from '../../__mocks__/withIntl';
import { TEST_URL } from '../../__mocks__/jsonld';

describe('extractors.icon.document', () => {
	it('returns blog icon for BlogPosting', async () => {
		const icon = extractIconFromDocument('schema:BlogPosting', {});
		render(withIntl(icon));
		expect(await screen.findByTestId('blog-icon')).toBeVisible();
	});

	it('returns file icon for DigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:DigitalDocument', {});
		render(withIntl(icon));
		expect(await screen.findByTestId('file-icon')).toBeVisible();
	});

	it('returns document icon for TextDigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:TextDigitalDocument', {});
		render(withIntl(icon));
		expect(await screen.findByTestId('document-icon')).toBeVisible();
	});

	it('returns document icon for UndefinedLink', async () => {
		const icon = extractIconFromDocument('atlassian:UndefinedLink', {});
		render(withIntl(icon));
		expect(await screen.findByTestId('document-icon')).toBeVisible();
	});

	it('returns presentation icon for PresentationDigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:PresentationDigitalDocument', {});
		render(withIntl(icon));
		expect(await screen.findByTestId('presentation-icon')).toBeVisible();
	});

	it('returns spreadsheet icon for SpreadsheetDigitalDocument', async () => {
		const icon = extractIconFromDocument('schema:SpreadsheetDigitalDocument', {});
		render(withIntl(icon));
		expect(await screen.findByTestId('spreadsheet-icon')).toBeVisible();
	});

	it('returns document filled icon for Template', async () => {
		const icon = extractIconFromDocument('atlassian:Template', {});
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
		expect(icon).toBe(TEST_URL);
	});
});
