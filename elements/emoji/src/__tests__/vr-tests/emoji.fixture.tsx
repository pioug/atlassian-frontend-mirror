import React from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { Emoji } from '../../element';
import { IntlProvider } from 'react-intl-next';
import { EmojiRepository } from '../../resource';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';

// eslint-disable-next-line import/no-extraneous-dependencies
import { testingEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';

const emojiResponse = denormaliseEmojiServiceResponse(testingEmojis);

const emojiService = new EmojiRepository(emojiResponse.emojis);

const renderEmoji = (fitToHeight: number = 24) => {
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
	const smiling = emojiService.findByShortName(':smiley:');
	const smilingEmoji = smiling ? (
		<Emoji emoji={smiling} showTooltip={true} fitToHeight={fitToHeight} />
	) : (
		<span>[smiling emoji not found]</span>
	);
	return (
		<div style={{ lineHeight: `${fitToHeight}px` }}>
			{blueStarEmoji}
			{wtfEmoji}
			{smilingEmoji}
			Emoji at {fitToHeight}px.
		</div>
	);
};

export function EmojiSimple() {
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
