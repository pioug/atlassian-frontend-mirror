import React from 'react';

import { EmojiPreviewComponent } from '../../../../components/common/EmojiPreviewComponent';
import type { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';

const emoji: EmojiDescriptionWithVariations = {
	...imageEmoji,
};

describe('<EmojiPreviewComponent />', () => {
	it('should render an emoji preview if one is selected', async () => {
		const result = await renderWithIntl(<EmojiPreviewComponent emoji={emoji} />);
		const component = await result.findByAltText(emoji.name!);
		expect(component).toHaveAttribute('src', imageEmoji.representation.imagePath);
	});
});
