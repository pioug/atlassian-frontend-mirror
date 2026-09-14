// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

const iconEmptyWrapperStyles = css({
	width: '14px',
	height: '100%',
	display: 'inline-block',
	opacity: 0,
});

export const IconEmptyWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={iconEmptyWrapperStyles} {...props}>
		{children}
	</span>
);
