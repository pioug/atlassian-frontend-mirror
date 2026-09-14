// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

const iconTitleWrapperStyles = css({
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-all',
});

// The main 'wrapping' element, title of the content.
// NB: `white-space` adds little whitespace before wrapping.
// NB: `word-break` line breaks as soon as an overflow takes place.
export const IconTitleWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={iconTitleWrapperStyles} {...props}>
		{children}
	</span>
);
