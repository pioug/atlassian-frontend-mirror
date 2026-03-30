/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

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
	color: token('color.text.selected'),
	backgroundColor: token('color.background.accent.blue.subtlest'),
	borderLeft: `${token('border.width.selected')} solid ${token('color.text.selected')}`,
	'&:hover': {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
});

const customDropdownItemNotSelectedStyles = css({
	paddingLeft: token('space.200'),
	color: 'inherit',
	backgroundColor: 'transparent',
	borderLeft: `none`,
	'&:hover': {
		backgroundColor: token('color.background.input.hovered'),
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
