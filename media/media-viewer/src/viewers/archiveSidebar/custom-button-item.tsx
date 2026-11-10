/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import type { ButtonItemProps } from '@atlaskit/menu/types';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from '../../insetViewerContext';

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

// The row around the item owns the padding, hover, pressed and selected states in the inset viewer.
// ButtonItem sets its pressed state on `:active:active`, so the overrides use the same selector to
// replace it.
const insetViewerItemStyles = css({
	paddingBlock: token('space.0'),
	paddingInline: token('space.0'),
	// Nothing above the list sets a text colour, so without this it would inherit the host page's.
	color: `${token('color.text')}`,
	'&:hover': {
		backgroundColor: 'transparent',
		color: `${token('color.text')}`,
	},
	'&:active': {
		'&:active': {
			backgroundColor: 'transparent',
			color: `${token('color.text')}`,
		},
	},
});

const insetViewerSelectedItemStyles = css({
	color: `${token('color.text.selected')}`,
	'&:hover': {
		color: `${token('color.text.selected')}`,
	},
	'&:active': {
		'&:active': {
			color: `${token('color.text.selected')}`,
		},
	},
});

export function CustomButtonItem({
	children,
	onClick,
	isSelected,
	...rest
}: ButtonItemProps): JSX.Element {
	const isInsetViewer = useIsInsetViewer();
	return (
		<ButtonItem
			onClick={onClick}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			css={[
				!isInsetViewer && itemStyles,
				isInsetViewer && insetViewerItemStyles,
				isInsetViewer && isSelected && insetViewerSelectedItemStyles,
			]}
			// The row draws the selected state in the inset viewer, so only the semantics come from here.
			aria-current={isInsetViewer && isSelected ? 'true' : undefined}
			{...rest}
		>
			{children}
		</ButtonItem>
	);
}
