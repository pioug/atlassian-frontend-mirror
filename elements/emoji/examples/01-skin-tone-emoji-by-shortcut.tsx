import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import type { EmojiProvider } from '../src/resource';
import { ResourcedEmoji } from '../src/element';
import { IntlProvider } from 'react-intl-next';

export default function Example(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<ResourcedEmoji
				emojiId={{ shortName: ':thumbsup:' }}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true}
			/>
			<ResourcedEmoji
				emojiId={{ shortName: ':thumbsup::skin-tone-2:' }}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true}
			/>
			<ResourcedEmoji
				emojiId={{ shortName: ':thumbsup::skin-tone-3:' }}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true}
			/>
			<ResourcedEmoji
				emojiId={{ shortName: ':thumbsup::skin-tone-4:' }}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true}
			/>
			<ResourcedEmoji
				emojiId={{ shortName: ':thumbsup::skin-tone-5:' }}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true}
			/>
			<ResourcedEmoji
				emojiId={{ shortName: ':thumbsup::skin-tone-6:' }}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true}
			/>
			<ResourcedEmoji
				emojiId={{
					shortName: ':thumbsup::skin-tone-7:' /* invalid - will fallback to text render */,
				}}
				emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				showTooltip={true} /* should not show tooltip */
			/>
		</IntlProvider>
	);
}
