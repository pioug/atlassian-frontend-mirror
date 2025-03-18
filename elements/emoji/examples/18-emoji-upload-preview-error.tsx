import React from 'react';
import { token } from '@atlaskit/tokens';
import { default as EmotionEmojiUploadPicker } from '../src/components/common/EmojiUploadPicker';
import { default as CompiledEmojiUploadPicker } from '../src/components/compiled/common/EmojiUploadPicker';
import { emojiPickerWidth } from '../src/util/constants';
import { onUploadEmoji, onUploadCancelled } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

const defaultStyles = {
	width: emojiPickerWidth,
	border: `1px solid ${token('color.border', '#ddd')}`,
	margin: '20px',
};

export default function Example() {
	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={defaultStyles}>
				{fg('platform_editor_css_migrate_emoji') ? (
					<CompiledEmojiUploadPicker
						errorMessage="Unable to upload"
						onUploadEmoji={onUploadEmoji}
						onUploadCancelled={onUploadCancelled}
					/>
				) : (
					<EmotionEmojiUploadPicker
						onUploadEmoji={onUploadEmoji}
						onUploadCancelled={onUploadCancelled}
					/>
				)}
			</div>
		</IntlProvider>
	);
}
