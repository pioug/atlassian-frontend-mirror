import React, { cloneElement, type ChangeEvent, useState } from 'react';

import { Text } from '@atlaskit/primitives/compiled';

import { EmojiResource, type EmojiProvider, type EmojiResourceConfig } from '../src/resource';
import type { Props } from './demo-resource-control';

export const ResourcedEmojiControl = (props: React.PropsWithChildren<Props>): React.JSX.Element => {
	const { customEmojiProvider, children, emojiConfig, customPadding } = props;
	const paddingBottom = customPadding ? `${customPadding}px` : '30px';

	const [emojiProvider, setEmojiProvider] = useState<Promise<EmojiProvider>>(
		customEmojiProvider || Promise.resolve(new EmojiResource(emojiConfig)),
	);

	const refreshEmoji = (emojiConfig: EmojiResourceConfig) => {
		setEmojiProvider(Promise.resolve(new EmojiResource(emojiConfig)));
	};

	const emojiConfigChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		// eslint-disable-next-line no-new-func
		const config = new Function('', `return (${event.target.value})`)();
		refreshEmoji(config);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: '10px' }}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ paddingBottom }}>{cloneElement(children, { emojiProvider })}</div>
			<div>
				<Text as="p">
					<label htmlFor="emoji-urls">EmojiLoader config</label>
				</Text>
				<Text as="p">
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-textarea */}
					<textarea
						id="emoji-urls"
						rows={15}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ height: '280px', width: '500px' }}
						onChange={emojiConfigChange}
						defaultValue={JSON.stringify(emojiConfig, null, 2)}
					/>
				</Text>
			</div>
		</div>
	);
};
