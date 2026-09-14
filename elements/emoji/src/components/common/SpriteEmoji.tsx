/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type SpriteRepresentation } from '../../types';
import { EmojiNodeWrapper } from './Emoji';
import type { Props } from './Emoji';
import { emojiNodeStyles, commonSelectedStyles, selectOnHoverStyles, emojiSprite } from './styles';

// Pure functional components are used in favour of class based components, due to the performance!
// When rendering 1500+ emoji using class based components had a significant impact.
// TODO: add UFO tracking for sprite emoji
export const SpriteEmoji = (props: Props): JSX.Element => {
	const { emoji, fitToHeight, selected, selectOnHover, className } = props;

	const representation = emoji.representation as SpriteRepresentation;
	const sprite = representation.sprite;

	const classes = `${emojiNodeStyles} ${selected ? commonSelectedStyles : ''} ${
		selectOnHover ? selectOnHoverStyles : ''
	} ${className ? className : ''}`;

	let sizing = {};
	if (fitToHeight) {
		if (expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true)) {
			sizing = {
				minHeight: `${fitToHeight}px`,
				minWidth: `${fitToHeight}px`,
			};
		} else {
			sizing = {
				width: `${fitToHeight}px`,
				height: `${fitToHeight}px`,
				minHeight: `${fitToHeight}px`,
				minWidth: `${fitToHeight}px`,
			};
		}
	}

	const xPositionInPercent = (100 / (sprite.column - 1)) * (representation.xIndex - 0);
	const yPositionInPercent = (100 / (sprite.row - 1)) * (representation.yIndex - 0);
	const style = {
		backgroundImage: `url(${sprite.url})`,
		backgroundPosition: `${xPositionInPercent}% ${yPositionInPercent}%`,
		backgroundSize: `${sprite.column * 100}% ${sprite.row * 100}%`,
		...sizing,
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<EmojiNodeWrapper {...props} type="sprite" className={classes}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766  */}
			<span className={emojiSprite} style={style} />
		</EmojiNodeWrapper>
	);
};
