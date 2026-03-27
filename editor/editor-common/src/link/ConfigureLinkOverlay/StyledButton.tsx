/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import type { ButtonProps } from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

const buttonStyles = css({
	display: 'flex',
	background: token('color.background.neutral'),
	color: token('color.icon'),
	'&:hover': {
		background: token('color.background.neutral.hovered'),
	},
	'&:active': {
		background: token('color.background.neutral.pressed'),
	},
	width: '1.375rem',
	height: '1.25rem',
});

export const StyledButton = ({
	innerRef,
	...props
}: ButtonProps & { innerRef?: React.Ref<HTMLElement> }): jsx.JSX.Element => {
	return (
		<Button
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			ref={innerRef}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={buttonStyles}
		/>
	);
};
