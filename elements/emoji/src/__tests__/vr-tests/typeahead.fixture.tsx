import React from 'react';
import { layers } from '@atlaskit/theme/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getMockEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';

import EmojiTypeAhead from '../../components/typeahead/EmojiTypeAhead';

const noop = () => {};
const emojiProvider = getEmojiProvider(
	{
		currentUser,
		uploadSupported: false,
	},
	getMockEmojis,
);

export function StandardEmojiTypeAhead(): React.JSX.Element {
	const position = 'below';
	const id = 'demo-input';

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<div style={{ padding: '10px' }}>
			<input
				id={id}
				aria-label="Demo Input"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					height: '20px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '10px',
				}}
			/>
			<EmojiTypeAhead
				target={`#${id}`}
				position={position}
				onSelection={noop}
				onOpen={noop}
				onClose={noop}
				query={''}
				emojiProvider={emojiProvider}
				zIndex={layers.modal()}
			/>
		</div>
	);
}
