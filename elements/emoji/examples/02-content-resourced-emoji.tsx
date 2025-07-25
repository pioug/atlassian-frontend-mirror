import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import type { EmojiProvider } from '../src/resource';
import { ResourcedEmoji } from '../src/element';
import { lorem } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

interface SampleEmojiProps {
	emojiProvider?: Promise<EmojiProvider>;
	fitToHeight?: number;
}

const lineStyle = (height: number = 24) => ({
	lineHeight: `${height}px`,
});

const SampleEmojis = (props: SampleEmojiProps) => (
	<IntlProvider locale="en">
		<ResourcedEmoji
			emojiId={{ shortName: ':grimacing:', id: '1f62c' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':blue_star:', id: 'atlassian-blue_star' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':yellow_star:', id: 'atlassian-yellow_star' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':sweat_smile:', id: '1f605' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':hamster:', id: '1f439' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':wtf:', id: 'wtf' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':not-an-emoji:', id: 'not-an-emoji' }}
			emojiProvider={props.emojiProvider || (getEmojiResource() as Promise<EmojiProvider>)}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
		<ResourcedEmoji
			emojiId={{ shortName: ':loading:', id: 'loading' }}
			emojiProvider={new Promise(() => {})}
			showTooltip={true}
			fitToHeight={props.fitToHeight}
		/>
	</IntlProvider>
);

export default function Example() {
	return (
		<div>
			<h1>
				Heading 1 <SampleEmojis />
			</h1>
			<h2>
				Heading 2 <SampleEmojis />
			</h2>
			<h3>
				Heading 3 <SampleEmojis />
			</h3>
			<h4>
				Heading 4 <SampleEmojis />
			</h4>
			<h5>
				Heading 5 <SampleEmojis />
			</h5>
			<h6>
				Heading 6 <SampleEmojis />
			</h6>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<p style={lineStyle()}>
				Paragraph <SampleEmojis />
			</p>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-code, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<code style={lineStyle()}>
				Code <SampleEmojis />
			</code>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<p style={lineStyle()}>
				{lorem} <SampleEmojis /> {lorem} <SampleEmojis /> {lorem} <SampleEmojis /> {lorem}
			</p>
		</div>
	);
}
