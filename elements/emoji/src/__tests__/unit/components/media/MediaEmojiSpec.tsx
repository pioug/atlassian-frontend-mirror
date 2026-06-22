import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import type { EmojiProvider } from '../../../../api/EmojiResource';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import EmojiPicker from '../../../../components/picker/EmojiPicker';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';
import {
	getEmojiResourcePromiseFromRepository,
	mediaEmoji,
	mediaEmojiId,
	newSiteEmojiRepository,
} from '../../_test-data';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../_testing-library';
import { emojisVisible, findEmojiPreview, setupPicker } from '../picker/_emoji-picker-test-helpers';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockReturnValue(false),
}));

describe('Media Emoji Handling across components', () => {
	mockReactDomWarningGlobal();

	let emojiProvider: Promise<EmojiProvider>;

	beforeEach(() => {
		emojiProvider = getEmojiResourcePromiseFromRepository(newSiteEmojiRepository());
	});

	afterEach(jest.clearAllMocks);

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
			const { container } = renderWithIntl(<EmojiPicker emojiProvider={emojiProvider} />);
			// Wait until loaded
			await screen.findByLabelText('Emoji picker');

			const list = screen.getByRole('grid', { name: 'Emojis' });
			const emojis = await emojisVisible(list);
			expect(emojis).toHaveLength(1);

			const emoji = emojis[0];
			expect(emoji).toHaveAttribute('aria-label', ':media:');

			// CachingMediaEmoji
			expect(container.querySelectorAll('img.emoji')).toHaveLength(1);
		});

		it('Media emoji rendered in picker preview', async () => {
			const { container } = await setupPicker({ emojiProvider });

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
		it.each([
			[false, mediaEmoji.representation.mediaPath],
			[true, mediaEmoji.altRepresentation!.mediaPath],
		])(
			'Media emoji rendered in type ahead when unicode gate is %s',
			async (gateEnabled, expectedSrc) => {
				setupEditorExperiments('test', {
					platform_use_unicode_emojis: gateEnabled,
				});

				renderWithIntl(<EmojiTypeAhead emojiProvider={emojiProvider} />);
				const emoji = await screen.findByAltText(mediaEmoji.name);

				expect(emoji).toBeInTheDocument();
				expect(emoji).toHaveAttribute('src', expectedSrc);
				expect(emoji).toHaveAttribute('data-emoji-id', mediaEmojiId.id);
				expect(emoji).toHaveAttribute('data-emoji-short-name', mediaEmojiId.shortName);
			},
		);
	});
});
