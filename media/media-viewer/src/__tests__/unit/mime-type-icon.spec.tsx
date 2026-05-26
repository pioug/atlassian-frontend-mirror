import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { MimeTypeIcon } from '@atlaskit/media-ui';

describe('MimeType Icon', () => {
	it('mimeType cannot be categorised, default to mediaTypeIcon', async () => {
		render(<MimeTypeIcon mediaType={'image'} mimeType={'image/png'} name={'test.png'} />);
		// Falls back to MediaTypeIcon (default testId 'file-type-icon')
		const wrapper = screen.getByTestId('file-type-icon');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveAttribute('data-type', 'image');
		await expect(document.body).toBeAccessible();
	});

	it.each([
		{ mime: 'application/pdf', name: '.pdf', label: 'pdf' },
		{
			mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			name: '.excel',
			label: 'excel-spreadsheet',
		},
		{ mime: 'image/gif', name: '.gif', label: 'giphy' },
		{
			mime: 'application/vnd.ms-powerpoint',
			name: '.powerpoint',
			label: 'powerpoint-presentation',
		},
		{ mime: 'application/msword', name: '.wordDoc', label: 'microsoft-word' },
		{ mime: 'binary/octet-stream', name: '.sketch', label: 'sketch' },
		{ mime: 'application/octet-stream', name: '.fig', label: 'figma' },
		{ mime: 'binary/octet-stream', name: '.exe', label: 'executable' },
		{
			mime: 'application/vnd.google-apps.document',
			name: '.google-docs',
			label: 'google-docs',
		},
		{
			mime: 'application/vnd.google-apps.presentation',
			name: '.google-slides',
			label: 'google-slides',
		},
		{
			mime: 'application/vnd.google-apps.spreadsheet',
			name: '.goole-sheets',
			label: 'google-sheets',
		},
		{
			mime: 'application/vnd.google-apps.form',
			name: '.google-form',
			label: 'google-form',
		},
		{ mime: 'text/csv', name: '.csv', label: 'spreadsheet' },
		{
			mime: 'application/x-iwork-keynote-sffkey',
			name: '.presentation',
			label: 'presentation',
		},
		{ mime: 'text/plain', name: '.source-code.c', label: 'source-code' },
	])('mimeType $mime renders the $label icon', ({ mime, name, label }) => {
		render(<MimeTypeIcon mediaType={'doc'} mimeType={mime} name={name} testId={'mime-icon'} />);
		const wrapper = screen.getByTestId('mime-icon');
		expect(wrapper).toHaveAttribute('data-type', label);
		// Mime-specific path — wrapper is a div, MediaTypeIcon fallback is a span
		expect(wrapper.tagName).toBe('DIV');
		// And the icon labels its glyph with the same label
		expect(screen.getByLabelText(label)).toBeInTheDocument();
	});

	it('defaults to large size', () => {
		render(<MimeTypeIcon mediaType={'image'} mimeType={'image/png'} name={'test.png'} />);
		// Falls back to MediaTypeIcon size="large" → renders 24px SVG
		const wrapper = screen.getByRole('img', { name: 'media-type' });
		// eslint-disable-next-line testing-library/no-node-access
		const svg = wrapper.querySelector('svg');
		expect(svg).toHaveAttribute('width', '24');
	});

	it('accepts size prop', () => {
		render(
			<MimeTypeIcon mediaType={'image'} mimeType={'image/png'} name={'test.png'} size="small" />,
		);
		const wrapper = screen.getByRole('img', { name: 'media-type' });
		// eslint-disable-next-line testing-library/no-node-access
		const svg = wrapper.querySelector('svg');
		expect(svg).toHaveAttribute('width', '16');
	});
});
