import React from 'react';

import { EmojiTypeAheadItem } from '@atlaskit/emoji/emoji-type-ahead-item';
import { getStandardEmojis } from '@atlaskit/util-data-test/get-standard-emojis';

const wave = getStandardEmojis().find((emoji) => emoji.shortName === ':wave:')!;

export default function EmojiTypeAheadItemPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<EmojiTypeAheadItem emoji={wave} onMouseMove={() => {}} onSelection={() => {}} selected />
		</div>
	);
}
