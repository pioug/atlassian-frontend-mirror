/** @jsx jsx */
import { type FC } from 'react';

import { css, jsx } from '@emotion/react';

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
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	margin: `0 auto ${token('space.300', '24px')}`,
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
