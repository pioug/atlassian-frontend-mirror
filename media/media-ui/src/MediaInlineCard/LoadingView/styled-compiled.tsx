/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const spinnerWrapperStyles = css({
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-all',
	verticalAlign: 'baseline',
	marginLeft: token('space.025', '2px'),
});

export const SpinnerWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={spinnerWrapperStyles} {...props}>
		{children}
	</span>
);
