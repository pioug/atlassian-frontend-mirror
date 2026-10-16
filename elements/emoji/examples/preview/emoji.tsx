import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import ResourcedEmoji from '@atlaskit/emoji/resourced-emoji';
import type { EmojiProvider } from '@atlaskit/emoji/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<ResourcedEmoji
					fitToHeight={56}
					emojiId={{ id: '1f604', shortName: ':smile:' }}
					emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				/>
				<ResourcedEmoji
					fitToHeight={56}
					emojiId={{ id: '1f389', shortName: ':tada:' }}
					emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				/>
				<ResourcedEmoji
					fitToHeight={56}
					emojiId={{ id: '2764', shortName: ':heart:' }}
					emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				/>
			</Box>
		</IntlProvider>
	);
}
