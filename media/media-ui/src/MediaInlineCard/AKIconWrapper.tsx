/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

// Used for 'untrue' icons which claim to be 16x16 but
// are less than that in height/width.
// TODO: Replace this override with proper AtlasKit solution.
const akIconWrapperStyles = css({
	marginRight: token('space.negative.025'),
});

export const AKIconWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={akIconWrapperStyles} {...props}>
		{children}
	</span>
);
