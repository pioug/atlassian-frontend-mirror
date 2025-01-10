/* eslint-disable no-undef, import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HelpArticle from '../../components/HelpArticle';
import { BODY_FORMAT_TYPES } from '../../model/HelpArticle';

const adfPhrase = 'test adf document';

const AdfDocument = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: adfPhrase,
				},
			],
		},
	],
};

describe('HelpArticle', () => {
	const TITLE = 'title content';
	const BODY = 'body content';
	const TITLE_LINK_URL = 'https://atlaskit.atlassian.com/';

	describe('with defined Title', () => {
		it('should render title', () => {
			render(<HelpArticle title={TITLE} />);
			const title = screen.getByRole('heading', { name: TITLE });
			expect(title).toBeInTheDocument();
		});

		it('should render html body inside iframe', async () => {
			render(<HelpArticle body={BODY} bodyFormat={BODY_FORMAT_TYPES.html} />);

			// Wait for the iframe to be rendered
			await waitFor(() => {
				const iframe = document.getElementById('help-iframe');
				expect(iframe).toBeInTheDocument();
			});

			// Get the iframe and check its content
			const iframe = document.getElementById('help-iframe') as HTMLIFrameElement;
			const iframeDocument = iframe.contentWindow?.document;

			expect(iframeDocument?.body.innerHTML).toContain(BODY);
		});

		it('should render ADF document inside', () => {
			render(<HelpArticle body={AdfDocument} bodyFormat={BODY_FORMAT_TYPES.adf} />);

			expect(screen.getByText(adfPhrase)).toBeInTheDocument();
		});

		it('should render title with link', () => {
			render(<HelpArticle title={TITLE} titleLinkUrl={TITLE_LINK_URL} />);

			const titleLink = screen.getByRole('link', { name: new RegExp(TITLE) });
			const shortcutIcon = screen.getByLabelText('link icon');

			expect(titleLink).toHaveAttribute('href', TITLE_LINK_URL);
			expect(titleLink).toHaveAttribute('target', '_blank');
			expect(shortcutIcon).toBeInTheDocument();
		});
	});
});
