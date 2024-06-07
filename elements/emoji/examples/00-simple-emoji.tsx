import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiRepository } from '@atlaskit/util-data-test/get-emoji-repository';
import { Emoji } from '../src/element';
import { IntlProvider } from 'react-intl-next';

const emojiService = getEmojiRepository();

export const renderEmoji = (fitToHeight: number = 24) => {
	const blueStar = emojiService.findById('atlassian-blue_star');
	const blueStarEmoji = blueStar ? (
		<Emoji emoji={blueStar} showTooltip={true} fitToHeight={fitToHeight} />
	) : (
		<span>[blueStar emoji not found]</span>
	);
	const wtf = emojiService.findByShortName(':wtf:');
	const wtfEmoji = wtf ? (
		<Emoji emoji={wtf} showTooltip={true} fitToHeight={fitToHeight} selected={true} />
	) : (
		<span>[wtf emoji not found]</span>
	);
	const grimacing = emojiService.findByShortName(':grimacing:');
	const grimacingEmoji = grimacing ? (
		<Emoji emoji={grimacing} showTooltip={true} fitToHeight={fitToHeight} />
	) : (
		<span>[grimacing emoji not found]</span>
	);
	return (
		<div style={{ lineHeight: `${fitToHeight}px` }}>
			{blueStarEmoji}
			{wtfEmoji}
			{grimacingEmoji}
			Emoji at {fitToHeight}px.
		</div>
	);
};

export default function Example() {
	return (
		<IntlProvider locale="en">
			<div>{renderEmoji(12)}</div>
			<br />
			<div>{renderEmoji()}</div>
			<br />
			<div>{renderEmoji(40)}</div>
			<br />
			<div>{renderEmoji(64)}</div>
			<br />
		</IntlProvider>
	);
}
