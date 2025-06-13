/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const cardStyles = css({
	borderColor: token('color.border.discovery'),
	borderStyle: 'solid',
	borderWidth: 0,
	paddingBlockEnd: token('space.050'),
	paddingBlockStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	paddingInlineStart: token('space.050'),
	'@media (min-width: 30rem)': {
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	'@media (min-width: 48rem)': {
		borderWidth: token('border.width'),
		paddingBlockEnd: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
	},
	'@media (min-width: 64rem)': {
		borderWidth: token('border.width.outline'),
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default () => (
	<div css={cardStyles}>
		Border becomes narrower at smaller breakpoints. Try it out by resizing the browser window.
	</div>
);
