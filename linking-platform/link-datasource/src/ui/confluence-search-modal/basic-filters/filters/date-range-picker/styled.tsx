/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { B400, B50, N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const customDropdownItemBaseStyles = css({
	height: '36px',
	width: '100%',
	display: 'flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	boxSizing: 'border-box',
	'&:hover': {
		cursor: 'default',
	},
});

const customDropdownItemSelectedStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingLeft: '15px',
	color: token('color.text.selected', B400),
	backgroundColor: token('color.background.accent.blue.subtlest', B50),
	borderLeft: `2px solid ${token('color.text.selected', B400)}`,
	'&:hover': {
		backgroundColor: token('color.background.accent.blue.subtlest', B50),
	},
});

const customDropdownItemNotSelectedStyles = css({
	paddingLeft: token('space.200', '16px'),
	color: 'inherit',
	backgroundColor: 'transparent',
	borderLeft: `none`,
	'&:hover': {
		backgroundColor: token('color.background.input.hovered', N20),
	},
});

export const CustomDropdownItem = (
	props: React.PropsWithChildren<{ isSelected: boolean; onClick: () => void }>,
) => (
	<div
		{...props}
		css={[
			customDropdownItemBaseStyles,
			props.isSelected ? customDropdownItemSelectedStyles : customDropdownItemNotSelectedStyles,
		]}
	>
		{props.children}
	</div>
);
