import React, { useState } from 'react';

import { Emoji } from '@atlaskit/emoji/emoji';
import EmojiPlaceholder from '@atlaskit/emoji/emoji-placeholder';
import { getStandardEmojis } from '@atlaskit/util-data-test/get-standard-emojis';

const badge = getStandardEmojis().find((emoji) => emoji.shortName === ':medal:')!;

export default function EmojiLoadingExample(): React.JSX.Element {
	const [loaded, setLoaded] = useState(false);
	return (
		<div>
			<button type="button" onClick={() => setLoaded((value) => !value)}>
				{loaded ? 'Show loading state' : 'Resolve emoji'}
			</button>
			{loaded ? <Emoji emoji={badge} /> : <EmojiPlaceholder shortName={badge.shortName} loading />}
		</div>
	);
}
