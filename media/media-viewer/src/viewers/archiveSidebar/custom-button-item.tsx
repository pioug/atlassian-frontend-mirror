/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { ButtonItem, type ButtonItemProps } from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

const itemStyles = css({
	backgroundColor: `${token('color.background.neutral.subtle')}`,
	fill: `${token('color.icon.success')}`,
	color: `${token('color.text')}`,
	'&:hover': {
		backgroundColor: `${token('color.background.neutral.subtle.hovered')}`,
		color: `${token('color.text')}`,
	},
	'&:active': {
		backgroundColor: `${token('color.background.neutral.subtle.pressed')}`,
		color: `${token('color.text')}`,
	},
});

export function CustomButtonItem({ children, onClick, ...rest }: ButtonItemProps): JSX.Element {
	return (
		<ButtonItem
			onClick={onClick}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={itemStyles}
			{...rest}
		>
			{children}
		</ButtonItem>
	);
}
