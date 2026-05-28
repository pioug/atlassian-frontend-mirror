import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import type { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji } from '../../_test-data';
import { EmojiPreviewComponent } from '../../../../components/common/EmojiPreviewComponent';
import { renderWithIntl } from '../../_testing-library';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockReturnValue(false),
}));

const emoji: EmojiDescriptionWithVariations = {
	...imageEmoji,
};

describe('<EmojiPreviewComponent />', () => {
	afterEach(jest.clearAllMocks);

	it.each([
		[false, imageEmoji.representation.imagePath],
		[true, imageEmoji.altRepresentation.imagePath],
	])(
		'should render an emoji preview if one is selected when unicode gate is %s',
		async (gateEnabled, expectedSrc) => {
			jest.mocked(fg).mockImplementation(
				(flagName) => flagName === 'platform_twemoji_removal_unicode_emojis' && gateEnabled,
			);

			const result = await renderWithIntl(<EmojiPreviewComponent emoji={emoji} />);

			const component = await result.findByAltText(emoji.name!);
			expect(component).toHaveAttribute('src', expectedSrc);
		},
	);
});
