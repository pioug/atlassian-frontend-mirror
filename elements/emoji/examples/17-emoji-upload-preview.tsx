import React from 'react';

import { IntlProvider } from 'react-intl';

import { token } from '@atlaskit/tokens';

import { onUploadCancelled } from '../example-helpers/on-upload-cancelled';
import { onUploadEmoji } from '../example-helpers/on-upload-emoji';
import EmojiUploadPicker from '../src/components/common/EmojiUploadPicker';
import { emojiPickerWidth } from '../src/util/constants';

const defaultStyles = {
	width: emojiPickerWidth,
	border: `${token('border.width')} solid ${token('color.border')}`,
	margin: '20px',
};

export default function Example(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={defaultStyles}>
				<EmojiUploadPicker onUploadEmoji={onUploadEmoji} onUploadCancelled={onUploadCancelled} />
			</div>
		</IntlProvider>
	);
}
