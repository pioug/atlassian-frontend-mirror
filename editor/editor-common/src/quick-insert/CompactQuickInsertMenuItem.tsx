import React from 'react';

import { cssMap } from '@atlaskit/css';
import ButtonItem from '@atlaskit/menu/button-item';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- Compiled primitives do not provide Pressable.
import { Pressable, xcss } from '@atlaskit/primitives';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { QuickInsertMenuItemProps } from './QuickInsertMenuItem';
import { useQuickInsertMenuItemSelection } from './quickInsertMenuItemUtils';
import { useQuickInsertContext } from './useQuickInsertContext';

const styles = cssMap({
	iconContainer: {
		alignItems: 'center',
		display: 'flex',
		flexShrink: 0,
		justifyContent: 'center',
		minHeight: '24px',
		minWidth: '24px',
	},
	content: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
		minWidth: 0,
	},
	icon: {
		alignItems: 'center',
		backgroundColor: token('elevation.surface.overlay'),
		borderColor: token('color.border'),
		borderRadius: token('radius.medium'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		overflow: 'hidden',
		width: '32px',
	},
	iconLarge: {
		alignItems: 'center',
		backgroundColor: token('elevation.surface.overlay'),
		borderColor: token('color.border'),
		borderRadius: token('radius.large'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		display: 'flex',
		height: '32px',
		justifyContent: 'center',
		overflow: 'hidden',
		width: '32px',
	},
	shortcut: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
		color: token('color.text.subtle'),
		font: token('font.body.small'),
		paddingBlock: token('space.025'),
		paddingInline: token('space.050'),
	},
});

const itemStyles = xcss({
	alignItems: 'center',
	backgroundColor: 'elevation.surface.overlay',
	color: 'color.text',
	display: 'flex',
	gap: 'space.150',
	minHeight: '40px',
	paddingBlock: 'space.100',
	paddingInline: 'space.200',
	textAlign: 'start',
	width: '100%',
	':hover': {
		backgroundColor: 'elevation.surface.overlay.hovered',
	},
});

const selectedItemStyles = xcss({
	alignItems: 'center',
	backgroundColor: 'elevation.surface.overlay.hovered',
	color: 'color.text',
	display: 'flex',
	gap: 'space.150',
	minHeight: '40px',
	paddingBlock: 'space.100',
	paddingInline: 'space.200',
	position: 'relative',
	textAlign: 'start',
	width: '100%',
	':hover': {
		backgroundColor: 'elevation.surface.overlay.hovered',
	},
	'::before': {
		borderInlineStartColor: 'color.border.selected',
		borderInlineStartStyle: 'solid',
		borderInlineStartWidth: 'border.width.selected',
		content: "''",
		insetBlock: 'space.0',
		insetInlineStart: 'space.0',
		pointerEvents: 'none',
		position: 'absolute',
	},
});

const disabledItemStyles = xcss({
	alignItems: 'center',
	backgroundColor: 'elevation.surface.overlay',
	color: 'color.text.disabled',
	display: 'flex',
	gap: 'space.150',
	minHeight: '40px',
	paddingBlock: 'space.100',
	paddingInline: 'space.200',
	textAlign: 'start',
	width: '100%',
});

export const CompactQuickInsertMenuItem = ({
	ariaLabel,
	iconBefore,
	isDisabled,
	onSelect,
	shortcut,
	shouldWrapIcon = true,
	title,
}: QuickInsertMenuItemProps): React.JSX.Element => {
	const { item } = useQuickInsertContext();
	const { id, isSelected } = item ?? { id: undefined, isSelected: false };
	const handleClick = useQuickInsertMenuItemSelection(onSelect);
	if (!isExperimentEnabled('platform_editor_slash_command')) {
		const wrappedIcon =
			iconBefore && shouldWrapIcon ? <Box xcss={styles.icon}>{iconBefore}</Box> : iconBefore;

		return (
			<ButtonItem
				aria-label={ariaLabel}
				aria-selected={isSelected}
				iconBefore={wrappedIcon}
				id={id}
				isDisabled={isDisabled}
				isSelected={isSelected}
				onClick={handleClick}
				role="option"
			>
				<Inline alignBlock="center" spread="space-between">
					<Text>{title}</Text>
					{shortcut && (
						<Box as="span" xcss={styles.shortcut}>
							{shortcut}
						</Box>
					)}
				</Inline>
			</ButtonItem>
		);
	}
	const wrappedIcon =
		iconBefore && shouldWrapIcon ? <Box xcss={styles.iconLarge}>{iconBefore}</Box> : iconBefore;

	return (
		<Pressable
			aria-label={ariaLabel}
			aria-selected={isSelected}
			id={id}
			isDisabled={isDisabled}
			onClick={handleClick}
			role="option"
			xcss={isDisabled ? disabledItemStyles : isSelected ? selectedItemStyles : itemStyles}
		>
			{wrappedIcon && <Box xcss={styles.iconContainer}>{wrappedIcon}</Box>}
			<Inline alignBlock="center" spread="space-between" xcss={styles.content}>
				<Text>{title}</Text>
				{shortcut && (
					<Box as="span" xcss={styles.shortcut}>
						{shortcut}
					</Box>
				)}
			</Inline>
		</Pressable>
	);
};
