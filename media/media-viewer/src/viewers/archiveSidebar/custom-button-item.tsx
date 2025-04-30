/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { ButtonItem, ButtonItemProps } from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';
import { DN500 } from '@atlaskit/theme/colors';

const itemStyles = css({
	backgroundColor: `${token('color.background.neutral.subtle', '#101214')}`,
	fill: `${token('color.icon.success', '#101214')}`,
	color: `${token('color.text', DN500)}`,
	'&:hover': {
		backgroundColor: `${token('color.background.neutral.subtle.hovered', '#A1BDD914')}`,
		color: `${token('color.text', DN500)}`,
	},
	'&:active': {
		backgroundColor: `${token('color.background.neutral.subtle.pressed', '#A6C5E229')}`,
		color: `${token('color.text', DN500)}`,
	},
});

export function CustomButtonItem({ children, onClick, ...rest }: ButtonItemProps) {
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
