import React from 'react';

import { Emoji } from '@atlaskit/emoji/emoji';
import { getStandardEmojis } from '@atlaskit/util-data-test/get-standard-emojis';

const wavingHand = getStandardEmojis().find((emoji) => emoji.shortName === ':wave:')!;

export default function EmojiBasicPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<Emoji emoji={wavingHand} />
		</div>
	);
}
