import React from 'react';
import { token } from '@atlaskit/tokens';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';

import { emojiPickerWidth } from '../src/util/constants';
import filters from '../src/util/filters';
import { IntlProvider } from 'react-intl-next';
import { EmojiPreviewComponent as EmotionEmojiPreviewComponent } from '../src/components/common/EmojiPreviewComponent';
import { EmojiPreviewComponent as CompiledEmojiPreviewComponent } from '../src/components/compiled/common/EmojiPreviewComponent';

import { fg } from '@atlaskit/platform-feature-flags';

const emojis = getEmojis();

const tongueEmoji = filters.byShortName(emojis, ':stuck_out_tongue_closed_eyes:');
const longTongueEmoji = {
	...tongueEmoji,
	name: `${tongueEmoji.name} ${tongueEmoji.name} ${tongueEmoji.name}`,
	shortName: `${tongueEmoji.shortName}_${tongueEmoji.shortName}_${tongueEmoji.shortName}`,
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
				{longTongueEmoji &&
					(fg('platform_editor_css_migrate_emoji') ? (
						<CompiledEmojiPreviewComponent emoji={longTongueEmoji} />
					) : (
						<EmotionEmojiPreviewComponent emoji={longTongueEmoji} />
					))}
			</div>
		</IntlProvider>
	);
}
