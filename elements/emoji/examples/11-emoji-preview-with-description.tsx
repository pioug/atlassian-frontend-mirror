import React from 'react';
import { token } from '@atlaskit/tokens';
import { IntlProvider } from 'react-intl-next';

import { emojiPickerWidth } from '../src/util/constants';
import { EmojiPreviewComponent as EmotionEmojiPreviewComponent } from '../src/components/common/EmojiPreviewComponent';
import { EmojiPreviewComponent as CompiledEmojiPreviewComponent } from '../src/components/compiled/common/EmojiPreviewComponent';

import { fg } from '@atlaskit/platform-feature-flags';

const emoji = {
	id: '118608',
	name: 'red star',
	shortName: ':red_star:',
	type: 'ATLASSIAN',
	category: 'ATLASSIAN',
	order: 2147483647,
	skinVariations: [],
	representation: {
		imagePath:
			'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/red_star_64.png',
		height: 64,
		width: 64,
	},
	hasSkinVariations: false,
	searchable: true,
};

const borderedStyle = {
	margin: '20px',
	border: `1px solid ${token('color.border', '#ddd')}`,
	backgroundColor: token('elevation.surface', 'white'),
	width: emojiPickerWidth,
};

export default function Example() {
	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={borderedStyle}>
				{emoji &&
					(fg('platform_editor_css_migrate_emoji') ? (
						<CompiledEmojiPreviewComponent emoji={emoji} />
					) : (
						<EmotionEmojiPreviewComponent emoji={emoji} />
					))}
			</div>
		</IntlProvider>
	);
}
