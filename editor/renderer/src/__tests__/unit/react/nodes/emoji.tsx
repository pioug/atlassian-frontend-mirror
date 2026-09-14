import React from 'react';
import { render } from '@testing-library/react';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import RendererEmoji from '../../../../react/nodes/emoji';

const emojiSpan = (container: HTMLElement, id: string) =>
	container.querySelector(`span[data-emoji-id="${id}"]`);

describe('Emoji', () => {
	it('should render Emoji UI component', () => {
		const { container } = render(<RendererEmoji shortName="shortname" id="id" text="fallback" />);

		expect(emojiSpan(container, 'id')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<RendererEmoji shortName="shortname" id="id" text="fallback" />);

		await expect(container).toBeAccessible();
	});

	describe('renderWithProvider with platform_editor_custom_emoji_unicode_fallback', () => {
		// With no emojiProvider, the renderer falls back to a plain <span> that
		// surfaces the fallback text in its `data-emoji-text` attribute and text
		// content. We assert on this span directly.

		describe('when the gate is OFF', () => {
			beforeEach(() => {
				failGate('platform_editor_custom_emoji_unicode_fallback');
			});

			it('should convert text to the fallback attribute', () => {
				const { container } = render(
					<RendererEmoji shortName="shortname" id="id" text="fallback" />,
				);

				expect(emojiSpan(container, 'id')).toHaveAttribute('data-emoji-text', 'fallback');
			});

			it('should render the fallback text for a custom emoji without fallback accessibility attributes', () => {
				const { container } = render(
					<RendererEmoji
						id="atlassian-disapproval"
						shortName=":atlassian-disapproval:"
						text=":atlassian-disapproval:"
					/>,
				);

				const span = emojiSpan(container, 'atlassian-disapproval');

				expect(span).toHaveAttribute('data-emoji-text', ':atlassian-disapproval:');
				expect(span).not.toHaveAttribute('title');
				expect(span).not.toHaveAttribute('aria-label');
				expect(span).not.toHaveAttribute('role');
				expect(span).toHaveTextContent(':atlassian-disapproval:');
			});

			it('should render the fallback text for a standard emoji', () => {
				const { container } = render(
					<RendererEmoji id="1f605" shortName=":sweat_smile:" text="😅" />,
				);

				const span = emojiSpan(container, '1f605');

				expect(span).toHaveAttribute('data-emoji-text', '😅');
				expect(span).toHaveTextContent('😅');
			});
		});

		describe('when the gate is ON', () => {
			beforeEach(() => {
				passGate('platform_editor_custom_emoji_unicode_fallback');
			});

			it('should render U+FFFD for a custom emoji', () => {
				const { container } = render(
					<RendererEmoji
						id="atlassian-disapproval"
						shortName=":atlassian-disapproval:"
						text=":atlassian-disapproval:"
					/>,
				);

				const span = emojiSpan(container, 'atlassian-disapproval');

				expect(span).toHaveAttribute('data-emoji-text', '�');
				expect(span).toHaveAttribute('title', ':atlassian-disapproval:');
				expect(span).toHaveAttribute('aria-label', 'Emoji :atlassian-disapproval:');
				expect(span).toHaveAttribute('role', 'img');
				expect(span?.textContent).toBe('�');
			});

			it('should render U+FFFD when the text attribute is empty for a custom emoji', () => {
				const { container } = render(
					<RendererEmoji id="atlassian-disapproval" shortName=":atlassian-disapproval:" text="" />,
				);

				const span = emojiSpan(container, 'atlassian-disapproval');

				expect(span).toHaveAttribute('data-emoji-text', '�');
				expect(span?.textContent).toBe('�');
			});

			it('should use shortName as a standard emoji fallback when text is empty', () => {
				const { container } = render(<RendererEmoji id="1f605" shortName="😅" text="" />);

				const span = emojiSpan(container, '1f605');

				expect(span).toHaveAttribute('data-emoji-text', '😅');
				expect(span).toHaveTextContent('😅');
			});

			it('should still render the Unicode text for a standard emoji without fallback accessibility attributes', () => {
				const { container } = render(
					<RendererEmoji id="1f605" shortName=":sweat_smile:" text="😅" />,
				);

				const span = emojiSpan(container, '1f605');

				expect(span).toHaveAttribute('data-emoji-text', '😅');
				expect(span).not.toHaveAttribute('title');
				expect(span).not.toHaveAttribute('aria-label');
				expect(span).not.toHaveAttribute('role');
				expect(span).toHaveTextContent('😅');
			});

			it('should still render standalone VS-16 Extended_Pictographic emoji as Unicode text', () => {
				const { container } = render(
					<RendererEmoji id="2764-fe0f" shortName=":heart:" text="❤️" />,
				);

				const span = emojiSpan(container, '2764-fe0f');

				expect(span).toHaveAttribute('data-emoji-text', '❤️');
				expect(span).toHaveTextContent('❤️');
			});

			it('should still render skin-tone modifier emoji as Unicode text', () => {
				const { container } = render(
					<RendererEmoji id="1f44b-1f3fd" shortName=":wave::skin-tone-4:" text="👋🏽" />,
				);

				const span = emojiSpan(container, '1f44b-1f3fd');

				expect(span).toHaveAttribute('data-emoji-text', '👋🏽');
				expect(span).toHaveTextContent('👋🏽');
			});
		});
	});
});
