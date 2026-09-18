// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const rightIconPositionWrapperStyles = css({
	marginLeft: token('space.025'),
	marginRight: token('space.050'),
	position: 'relative',
	display: 'inline-block',
});

export const RightIconPositionWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={rightIconPositionWrapperStyles} {...props}>
		{children}
	</span>
);
