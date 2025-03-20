import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { EmojiProvider } from '../../../../api/EmojiResource';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import { default as EmotionEmojiPicker } from '../../../../components/picker/EmojiPicker';
import { default as CompiledEmojiPicker } from '../../../../components/compiled/picker/EmojiPicker';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';
import {
	getEmojiResourcePromiseFromRepository,
	mediaEmoji,
	mediaEmojiId,
	newSiteEmojiRepository,
} from '../../_test-data';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../_testing-library';
import {
	emojisVisible,
	findEmojiPreview,
	setupCompiledPicker,
	setupEmotionPicker,
} from '../picker/_emoji-picker-test-helpers';

// cleanup `platform_editor_css_migrate_emoji` - delete emotion duplicate & can remove '- compiled' below
describe('Media Emoji Handling across components - compiled', () => {
	mockReactDomWarningGlobal();

	let emojiProvider: Promise<EmojiProvider>;

	beforeEach(() => {
		emojiProvider = getEmojiResourcePromiseFromRepository(newSiteEmojiRepository());
	});

	describe('<ResourcedEmoji/>', () => {
		it('ResourcedEmoji renders media emoji via Emoji', async () => {
			renderWithIntl(<ResourcedEmoji emojiProvider={emojiProvider} emojiId={mediaEmojiId} />);
			const emoji = await screen.findByAltText(mediaEmoji.name);

			expect(emoji).toBeInTheDocument();
			expect(emoji).toHaveAttribute('src', mediaEmoji.representation.mediaPath);
			expect(emoji).toHaveAttribute('data-emoji-id', mediaEmojiId.id);
			expect(emoji).toHaveAttribute('data-emoji-short-name', mediaEmojiId.shortName);
		});
	});

	describe('<EmojiPicker/>', () => {
		it('Media emoji rendered in picker', async () => {
			const { container } = renderWithIntl(<CompiledEmojiPicker emojiProvider={emojiProvider} />);
			// Wait until loaded
			await screen.findByLabelText('Emoji picker');

			const list = screen.getByRole('grid', { name: 'Emojis' });
			const emojis = await emojisVisible(list);
			expect(emojis).toHaveLength(1);

			const emoji = emojis[0];
			expect(emoji).toHaveAttribute('aria-label', ':media:');

			screen.debug(screen.getByRole('gridcell'));

			// CachingMediaEmoji
			expect(container.querySelectorAll('img.emoji')).toHaveLength(1);
		});

		it('Media emoji rendered in picker preview', async () => {
			const { container } = await setupCompiledPicker({ emojiProvider });

			const list = screen.getByRole('grid', { name: 'Emojis' });
			const emojis = await emojisVisible(list);
			expect(emojis).toHaveLength(1);

			const emoji = emojis[0];
			expect(emoji).toHaveAttribute('aria-label', ':media:');

			expect(container.querySelectorAll('img.emoji')).toHaveLength(1);

			// Hover to force preview
			await userEvent.hover(emoji);

			const emojiPreview = await findEmojiPreview();
			expect(emojiPreview).toBeVisible();

			await waitFor(() => expect(within(emojiPreview).getAllByRole('img')[0]));

			const previewEmojiDescription = within(emojiPreview).getAllByRole('img')[0];
			expect(previewEmojiDescription).toHaveAttribute('aria-label', ':media:');

			// CachingMediaEmoji
			expect(previewEmojiDescription.querySelectorAll('img.emoji')).toHaveLength(1);
		});
	});

	describe('<EmojiTypeAhead/>', () => {
		it('Media emoji rendered in type ahead', async () => {
			renderWithIntl(<EmojiTypeAhead emojiProvider={emojiProvider} />);
			const emoji = await screen.findByAltText(mediaEmoji.name);

			expect(emoji).toBeInTheDocument();
			expect(emoji).toHaveAttribute('src', mediaEmoji.representation.mediaPath);
			expect(emoji).toHaveAttribute('data-emoji-id', mediaEmojiId.id);
			expect(emoji).toHaveAttribute('data-emoji-short-name', mediaEmojiId.shortName);
		});
	});
});

describe('Media Emoji Handling across components - emotion', () => {
	mockReactDomWarningGlobal();

	let emojiProvider: Promise<EmojiProvider>;

	beforeEach(() => {
		emojiProvider = getEmojiResourcePromiseFromRepository(newSiteEmojiRepository());
	});

	describe('<ResourcedEmoji/>', () => {
		it('ResourcedEmoji renders media emoji via Emoji', async () => {
			renderWithIntl(<ResourcedEmoji emojiProvider={emojiProvider} emojiId={mediaEmojiId} />);
			const emoji = await screen.findByAltText(mediaEmoji.name);

			expect(emoji).toBeInTheDocument();
			expect(emoji).toHaveAttribute('src', mediaEmoji.representation.mediaPath);
			expect(emoji).toHaveAttribute('data-emoji-id', mediaEmojiId.id);
			expect(emoji).toHaveAttribute('data-emoji-short-name', mediaEmojiId.shortName);
		});
	});

	describe('<EmojiPicker/>', () => {
		it('Media emoji rendered in picker', async () => {
			const { container } = renderWithIntl(<EmotionEmojiPicker emojiProvider={emojiProvider} />);
			// Wait until loaded
			await screen.findByLabelText('Emoji picker');

			const list = screen.getByRole('grid', { name: 'Emojis' });
			const emojis = await emojisVisible(list);
			expect(emojis).toHaveLength(1);

			const emoji = emojis[0];
			expect(emoji).toHaveAttribute('aria-label', ':media:');

			screen.debug(screen.getByRole('gridcell'));

			// CachingMediaEmoji
			expect(container.querySelectorAll('img.emoji')).toHaveLength(1);
		});

		it('Media emoji rendered in picker preview', async () => {
			const { container } = await setupEmotionPicker({ emojiProvider });

			const list = screen.getByRole('grid', { name: 'Emojis' });
			const emojis = await emojisVisible(list);
			expect(emojis).toHaveLength(1);

			const emoji = emojis[0];
			expect(emoji).toHaveAttribute('aria-label', ':media:');

			expect(container.querySelectorAll('img.emoji')).toHaveLength(1);

			// Hover to force preview
			await userEvent.hover(emoji);

			const emojiPreview = await findEmojiPreview();
			expect(emojiPreview).toBeVisible();

			await waitFor(() => expect(within(emojiPreview).getAllByRole('img')[0]));

			const previewEmojiDescription = within(emojiPreview).getAllByRole('img')[0];
			expect(previewEmojiDescription).toHaveAttribute('aria-label', ':media:');

			// CachingMediaEmoji
			expect(previewEmojiDescription.querySelectorAll('img.emoji')).toHaveLength(1);
		});
	});

	describe('<EmojiTypeAhead/>', () => {
		it('Media emoji rendered in type ahead', async () => {
			renderWithIntl(<EmojiTypeAhead emojiProvider={emojiProvider} />);
			const emoji = await screen.findByAltText(mediaEmoji.name);

			expect(emoji).toBeInTheDocument();
			expect(emoji).toHaveAttribute('src', mediaEmoji.representation.mediaPath);
			expect(emoji).toHaveAttribute('data-emoji-id', mediaEmojiId.id);
			expect(emoji).toHaveAttribute('data-emoji-short-name', mediaEmojiId.shortName);
		});
	});
});
