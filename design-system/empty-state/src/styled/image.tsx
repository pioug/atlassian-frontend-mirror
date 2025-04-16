/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const CSS_VAR_MAX_WIDTH = '--max-width';
const CSS_VAR_MAX_HEIGHT = '--max-height';

type ImageProps = {
	height?: number;
	maxHeight: number;
	maxWidth: number;
	width?: number;
	src: string;
};

const imageStyles = css({
	display: 'block',
	maxWidth: `var(${CSS_VAR_MAX_WIDTH})`,
	maxHeight: `var(${CSS_VAR_MAX_HEIGHT})`,
	marginBlockEnd: token('space.300', '24px'),
	marginBlockStart: 0,
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
});

/**
 * __Image__
 *
 * Image in Empty State.
 *
 * @internal
 */
const Image: FC<ImageProps> = ({ maxHeight, maxWidth, height = 'auto', width = 'auto', src }) => (
	<img
		style={
			{
				[CSS_VAR_MAX_WIDTH]: `${maxWidth}px`,
				[CSS_VAR_MAX_HEIGHT]: `${maxHeight}px`,
			} as React.CSSProperties
		}
		width={width}
		height={height}
		alt=""
		role="presentation"
		css={imageStyles}
		src={src}
	/>
);

export default Image;
