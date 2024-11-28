/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@compiled/react';
import { N200 } from '@atlaskit/theme/colors';

const noLinkAppearanceStyles = css({
	color: token('color.text.subtlest', N200),
});

export const NoLinkAppearance = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={noLinkAppearanceStyles} {...props}>
		{children}
	</span>
);
