// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const lozengeWrapperStyles = css({
	display: 'inline-block',
	verticalAlign: '1px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		marginLeft: token('space.050'),
		paddingTop: token('space.025'),
		paddingRight: 0,
		paddingBottom: token('space.025'),
		paddingLeft: 0,
	},
});

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={lozengeWrapperStyles} {...props}>
		{children}
	</span>
);
