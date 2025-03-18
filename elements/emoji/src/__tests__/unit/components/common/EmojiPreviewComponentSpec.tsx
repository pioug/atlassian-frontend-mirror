import React from 'react';
import type { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji } from '../../_test-data';
import { EmojiPreviewComponent as EmotionEmojiPreviewComponent } from '../../../../components/common/EmojiPreviewComponent';
import { EmojiPreviewComponent as CompiledEmojiPreviewComponent } from '../../../../components/compiled/common/EmojiPreviewComponent';
import { renderWithIntl } from '../../_testing-library';

const emoji: EmojiDescriptionWithVariations = {
	...imageEmoji,
};

// cleanup `platform_editor_css_migrate_emoji`: delete "off" version and delete this outer describe
describe('platform_editor_css_migrate_emoji "on" - compiled', () => {
	describe('<EmojiPreviewComponent />', () => {
		it('should render an emoji preview if one is selected', async () => {
			const result = await renderWithIntl(<CompiledEmojiPreviewComponent emoji={emoji} />);

			const component = await result.findByAltText(emoji.name!);
			expect(component).toHaveAttribute('src', imageEmoji.representation.imagePath);
		});
	});
});

describe('platform_editor_css_migrate_emoji "off" - emotion', () => {
	describe('<EmojiPreviewComponent />', () => {
		it('should render an emoji preview if one is selected', async () => {
			const result = await renderWithIntl(<EmotionEmojiPreviewComponent emoji={emoji} />);

			const component = await result.findByAltText(emoji.name!);
			expect(component).toHaveAttribute('src', imageEmoji.representation.imagePath);
		});
	});
});
