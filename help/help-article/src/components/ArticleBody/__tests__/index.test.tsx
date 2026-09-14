/**
 * @jest-environment jsdom
 */
import React from 'react';
import { captureMessage } from '@sentry/browser';
import { cleanup, render, waitFor } from '@atlassian/testing-library';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import ArticleBody from '../index';
import { BODY_FORMAT_TYPES } from '../../../model/HelpArticle';

jest.mock('@sentry/browser', () => ({
	captureMessage: jest.fn(),
}));

const ARTICLE_BODY =
	'<h2>Customer Sentiment Analysis</h2><p><a href="https://example.com/article">Read more</a></p>';

const getIframe = (container: HTMLElement) => container.querySelector('iframe');

const getIframeContent = (container: HTMLElement) =>
	getIframe(container)?.contentDocument?.body?.innerHTML ?? '';

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

// The `nike_r19_render_unmount_help_article` gate switches the iframe rendering from the legacy
// `ReactDOM.render` API to `createRoot`. Only the gate-on path is exercised here because
// `ReactDOM.render` no longer exists in React 19, which is the React version this package is
// tested against.
describe('ArticleBody with nike_r19_render_unmount_help_article enabled', () => {
	beforeEach(() => {
		cleanup();
		document.body.replaceChildren();
		passGate('nike_r19_render_unmount_help_article');
	});

	it('renders the html article inside the iframe', async () => {
		const { container } = render(
			<ArticleBody body={ARTICLE_BODY} bodyFormat={BODY_FORMAT_TYPES.html} />,
		);

		await waitFor(() => {
			expect(getIframeContent(container)).toContain('Customer Sentiment Analysis');
		});
	});

	it('should pass basic accessibility checks', async () => {
		const { container } = render(
			<ArticleBody body={ARTICLE_BODY} bodyFormat={BODY_FORMAT_TYPES.html} />,
		);

		await waitFor(() => {
			expect(getIframeContent(container)).toContain('Customer Sentiment Analysis');
		});

		const iframeDocument = getIframe(container)?.contentDocument;
		if (!iframeDocument?.body) {
			throw new Error('Expected the iframe document body to exist');
		}
		await expect(iframeDocument.body).toBeAccessible();
	});

	it('makes article links open in a new tab', async () => {
		const { container } = render(
			<ArticleBody body={ARTICLE_BODY} bodyFormat={BODY_FORMAT_TYPES.html} />,
		);

		await waitFor(() => {
			const link = getIframe(container)?.contentDocument?.querySelector('a[href]');
			expect(link?.getAttribute('target')).toBe('_blank');
			expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
		});
	});

	it('calls onArticleRenderBegin once the article content has been written', async () => {
		const onArticleRenderBegin = jest.fn();

		render(
			<ArticleBody
				body={ARTICLE_BODY}
				bodyFormat={BODY_FORMAT_TYPES.html}
				onArticleRenderBegin={onArticleRenderBegin}
			/>,
		);

		await waitFor(() => {
			expect(onArticleRenderBegin).toHaveBeenCalled();
		});
	});

	it('logs a warning when the iframe window is unavailable', async () => {
		const originalFrames = window.frames;
		Object.defineProperty(window, 'frames', { configurable: true, value: {} });

		try {
			render(<ArticleBody body={ARTICLE_BODY} bodyFormat={BODY_FORMAT_TYPES.html} />);

			await waitFor(() => {
				expect(captureMessage).toHaveBeenCalledWith(
					'[@atlaskit/help-article] Help article iframe was not available after render',
					'warning',
				);
			});
		} finally {
			Object.defineProperty(window, 'frames', { configurable: true, value: originalFrames });
		}
	});

	it('updates the iframe content when the article body changes', async () => {
		const { container, rerender } = render(
			<ArticleBody body={ARTICLE_BODY} bodyFormat={BODY_FORMAT_TYPES.html} />,
		);

		await waitFor(() => {
			expect(getIframeContent(container)).toContain('Customer Sentiment Analysis');
		});

		rerender(
			<ArticleBody
				body={'<p>Another <a href="https://example.com/other">article</a></p>'}
				bodyFormat={BODY_FORMAT_TYPES.html}
			/>,
		);

		await waitFor(() => {
			expect(getIframeContent(container)).toContain('Another');
		});

		expect(getIframeContent(container)).not.toContain('Customer Sentiment Analysis');
	});
});
