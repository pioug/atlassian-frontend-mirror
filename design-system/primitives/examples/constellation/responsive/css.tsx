/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { media } from '@atlaskit/primitives/responsive';
import { token } from '@atlaskit/tokens';

const cardStyles = css({
	padding: token('space.050'),
	borderColor: token('color.border.discovery'),
	borderStyle: 'solid',
	borderWidth: token('border.width.0'),
	[media.above.xs]: {
		padding: token('space.100'),
	},
	[media.above.sm]: {
		padding: token('space.150'),
		borderWidth: token('border.width'),
	},
	[media.above.md]: {
		padding: token('space.200'),
		borderWidth: token('border.width.outline'),
	},
});

export default () => (
	<div css={cardStyles}>
		Border becomes narrower at smaller breakpoints. Try it out by resizing the browser window.
	</div>
);
