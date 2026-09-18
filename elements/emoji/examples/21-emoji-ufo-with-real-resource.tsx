import React from 'react';

import { IntlProvider } from 'react-intl';

import { ufologger } from '@atlassian/ufo-experimental/logger';
import { payloadPublisher } from '@atlassian/ufo/publisher';

import { getEmojiConfig } from '../example-helpers/get-emoji-config';
import { getRealEmojiProvider } from '../example-helpers/get-real-emoji-provider';
import { onSelection } from '../example-helpers/on-selection';
import { ResourcedEmojiControl } from '../example-helpers/resourced-emoji-control';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../src/util/constants';
import { EmojiTypeAheadTextInput } from './03-standard-emoji-typeahead';
import { RenderRealResourcedEmojis } from './22-resourced-emoji-real-resource-backend';
import { RenderSpriteEmojis } from './23-sprite-emoji';
import { EmojiPickerPopup } from './26-emoji-common-provider-with-real-backend';
/**
 * The publisher will be set up in product side in the real world
 * We add it in the example here so we can see events coming from UFO in the console
 */
if (typeof window !== 'undefined') {
	payloadPublisher.setup({
		product: 'examples',
		gasv3: {
			sendOperationalEvent: (event) => {
				console.log('sendOperationalEvent:', event);
			},
		},
		app: { version: { web: 'unknown' } },
	});

	ufologger.enable();
}

const provider = getRealEmojiProvider();

export default (): React.JSX.Element => (
	<>
		<IntlProvider locale="en">
			<ResourcedEmojiControl
				emojiConfig={getEmojiConfig()}
				customEmojiProvider={provider}
				children={
					<>
						<h3>Sampling is enabled for emoji rendered UFO experience</h3>
						<p>
							CachingEmoji(inside EmojiPicker)'s sampling rate is:{' '}
							{SAMPLING_RATE_EMOJI_RENDERED_EXP}
						</p>
						<br />
						<EmojiPickerPopup emojiProvider={provider} />
						<hr role="presentation" />
						<br />
						<RenderRealResourcedEmojis emailProvider={provider} />
						<hr role="presentation" />
						<h4>Sprite Emoji:</h4>
						<RenderSpriteEmojis />
						<hr role="presentation" />
						<h4>Emoji Typeahead:</h4>
						<EmojiTypeAheadTextInput
							label="Emoji search"
							onSelection={onSelection}
							emojiProvider={provider}
							position="below"
						/>
					</>
				}
			/>
		</IntlProvider>
	</>
);
