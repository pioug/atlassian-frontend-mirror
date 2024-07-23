/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button, { type ButtonProps } from '@atlaskit/button';
import { N30A, N40A, N60A, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const buttonStyles = css({
	display: 'flex',
	background: token('color.background.neutral', N30A),
	color: token('color.icon', N700),
	'&:hover': {
		background: token('color.background.neutral.hovered', N40A),
	},
	'&:active': {
		background: token('color.background.neutral.pressed', N60A),
	},
	width: '1.375rem',
	height: '1.25rem',
});

export const StyledButton = ({
	innerRef,
	...props
}: ButtonProps & { innerRef?: React.Ref<HTMLElement> }) => {
	return (
		<Button
			{...props}
			ref={innerRef}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={buttonStyles}
		/>
	);
};
