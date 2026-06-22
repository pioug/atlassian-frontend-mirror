import React from 'react';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import type { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji } from '../../_test-data';
import { EmojiPreviewComponent } from '../../../../components/common/EmojiPreviewComponent';
import { renderWithIntl } from '../../_testing-library';

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
			setupEditorExperiments('test', {
				platform_use_unicode_emojis: gateEnabled,
			});

			const result = await renderWithIntl(<EmojiPreviewComponent emoji={emoji} />);

			const component = await result.findByAltText(emoji.name!);
			expect(component).toHaveAttribute('src', expectedSrc);
		},
	);
});
