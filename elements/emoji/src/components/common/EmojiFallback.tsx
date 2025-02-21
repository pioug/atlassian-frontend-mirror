/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { type Props as EmojiProps, EmojiNodeWrapper } from './Emoji';
import { emojiNodeStyles, commonSelectedStyles, selectOnHoverStyles } from './styles';

const emojiFallbackStyles = css({
	display: 'flex',
	width: '100%',
	height: '100%',
	justifyContent: 'center',
	alignItems: 'center',
	overflow: 'hidden',
});

export const EmojiFallback = (props: React.PropsWithChildren<EmojiProps>) => {
	const { emoji, selected, selectOnHover, className } = props;
	const { fallback, shortName } = emoji;

	const classes = `${emojiNodeStyles} ${selected ? commonSelectedStyles : ''} ${
		selectOnHover ? selectOnHoverStyles : ''
	} ${className ? className : ''}`;

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<EmojiNodeWrapper type="image" {...props} className={classes}>
			<span css={emojiFallbackStyles}>{fallback || shortName}</span>
		</EmojiNodeWrapper>
	);
};

export default EmojiFallback;
