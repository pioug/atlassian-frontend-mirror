import React, { useMemo } from 'react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- Compiled primitives do not provide Pressable.
import { Box, Inline, Pressable, Stack, Text, xcss } from '@atlaskit/primitives';

import type { QuickInsertMenuItemProps } from './QuickInsertMenuItem';
import { useQuickInsertMenuItemSelection } from './quickInsertMenuItemUtils';
import { useQuickInsertContext } from './useQuickInsertContext';

const borderlessItemStyles = xcss({
	alignItems: 'start',
	backgroundColor: 'color.background.neutral.subtle',
	borderRadius: 'radius.medium',
	color: 'color.text',
	cursor: 'pointer',
	display: 'flex',
	gap: 'space.150',
	height: '88px',
	padding: 'space.150',
	textAlign: 'start',
	width: '100%',
});

const borderlessSelectedItemStyles = xcss({
	alignItems: 'start',
	backgroundColor: 'color.background.selected',
	borderRadius: 0,
	color: 'color.text',
	cursor: 'pointer',
	display: 'flex',
	gap: 'space.150',
	height: '88px',
	padding: 'space.150',
	position: 'relative',
	textAlign: 'start',
	width: '100%',
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

const borderlessDisabledItemStyles = xcss({
	alignItems: 'start',
	backgroundColor: 'color.background.neutral.subtle',
	borderRadius: 'radius.medium',
	color: 'color.text.disabled',
	cursor: 'not-allowed',
	display: 'flex',
	gap: 'space.150',
	height: '88px',
	padding: 'space.150',
	textAlign: 'start',
	width: '100%',
});

const hoveredItemStyles = xcss({
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
		borderRadius: 0,
	},
});

const iconStyles = xcss({
	alignItems: 'center',
	backgroundColor: 'elevation.surface.overlay',
	borderColor: 'color.border',
	borderRadius: 'radius.medium',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	display: 'flex',
	flexShrink: 0,
	height: '40px',
	justifyContent: 'center',
	overflow: 'hidden',
	width: '40px',
});

const iconLargeStyles = xcss({
	alignItems: 'center',
	backgroundColor: 'elevation.surface.overlay',
	borderColor: 'color.border',
	borderRadius: 'radius.large',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	display: 'flex',
	flexShrink: 0,
	height: '40px',
	justifyContent: 'center',
	overflow: 'hidden',
	width: '40px',
});

const descriptionStyles = xcss({ color: 'color.text.subtle' });

const shortcutStyles = xcss({
	backgroundColor: 'color.background.neutral',
	borderRadius: 'radius.small',
	color: 'color.text.subtle',
	font: 'font.body.small',
	paddingBlock: 'space.025',
	paddingInline: 'space.050',
});

export const ElementBrowserQuickInsertMenuItem = ({
	ariaLabel,
	description,
	iconBefore,
	isDisabled,
	onSelect,
	shortcut,
	shouldWrapIcon = true,
	title,
}: QuickInsertMenuItemProps): React.JSX.Element => {
	const { item } = useQuickInsertContext();
	const { id, isSelected } = item ?? { id: undefined, isSelected: false };
	const itemDescription = description ?? item?.description;
	const handleClick = useQuickInsertMenuItemSelection(onSelect);
	const itemStyles = useMemo(
		() => [
			isDisabled
				? borderlessDisabledItemStyles
				: isSelected
					? borderlessSelectedItemStyles
					: borderlessItemStyles,
			isExperimentEnabled('platform_editor_slash_command') &&
				!isDisabled &&
				!isSelected &&
				hoveredItemStyles,
		],
		[isDisabled, isSelected],
	);

	return (
		<Pressable
			aria-label={ariaLabel}
			aria-selected={isSelected}
			id={id}
			isDisabled={isDisabled}
			onClick={handleClick}
			role="option"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Memoizes composition of module-scoped xcss styles for Pressable.
			xcss={itemStyles}
		>
			{iconBefore && shouldWrapIcon ? (
				<Box
					xcss={isExperimentEnabled('platform_editor_slash_command') ? iconLargeStyles : iconStyles}
				>
					{iconBefore}
				</Box>
			) : (
				iconBefore
			)}
			<Stack space="space.050" grow="fill">
				<Inline alignBlock="center" spread="space-between" space="space.100">
					<Text maxLines={1} weight="medium">
						{title}
					</Text>
					{shortcut && (
						<Box as="span" xcss={shortcutStyles}>
							{shortcut}
						</Box>
					)}
				</Inline>
				{itemDescription && (
					<Box xcss={descriptionStyles}>
						<Text maxLines={2}>{itemDescription}</Text>
					</Box>
				)}
			</Stack>
		</Pressable>
	);
};
