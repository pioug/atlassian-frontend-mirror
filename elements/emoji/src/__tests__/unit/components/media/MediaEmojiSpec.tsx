import { waitUntil } from '@atlaskit/elements-test-helpers';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { EmojiProvider } from '../../../../api/EmojiResource';
import { CachingMediaEmoji } from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import EmojiPicker from '../../../../components/picker/EmojiPicker';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';
import { hasSelector } from '../../_emoji-selectors';
import { mountWithIntl } from '../../_enzyme';
import {
	getEmojiResourcePromiseFromRepository,
	mediaEmoji,
	mediaEmojiId,
	newSiteEmojiRepository,
} from '../../_test-data';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../_testing-library';
import { emojisVisible, findEmojiPreview, setupPicker } from '../picker/_emoji-picker-test-helpers';

describe('Media Emoji Handling across components', () => {
	mockReactDomWarningGlobal();

	let emojiProvider: Promise<EmojiProvider>;

	beforeEach(() => {
		emojiProvider = getEmojiResourcePromiseFromRepository(newSiteEmojiRepository());
	});

	describe('<ResourcedEmoji/>', () => {
		it('ResourcedEmoji renders media emoji via Emoji', async () => {
			const component = mountWithIntl(
				<ResourcedEmoji emojiProvider={emojiProvider} emojiId={mediaEmojiId} />,
			);

			await waitUntil(() => hasSelector(component, Emoji));
			const emojiDescription = component.find(Emoji).prop('emoji');
			expect(emojiDescription).toEqual(mediaEmoji);
			expect(component.find(Emoji).length).toEqual(1);
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

			screen.debug(screen.getByRole('gridcell'));

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

			const previewEmojiDescription = within(emojiPreview).getAllByRole('img')[0];
			expect(previewEmojiDescription).toHaveAttribute('aria-label', ':media:');

			// CachingMediaEmoji
			expect(previewEmojiDescription.querySelectorAll('img.emoji')).toHaveLength(1);
		});
	});

	describe('<EmojiTypeAhead/>', () => {
		it('Media emoji rendered in type ahead', async () => {
			const component = mountWithIntl(<EmojiTypeAhead emojiProvider={emojiProvider} />);

			await waitUntil(() => hasSelector(component, Emoji));

			const emojiDescription = component.find(Emoji).prop('emoji');
			expect(emojiDescription).toEqual(mediaEmoji);
			expect(component.find(CachingMediaEmoji).length).toEqual(1);
		});
	});
});
