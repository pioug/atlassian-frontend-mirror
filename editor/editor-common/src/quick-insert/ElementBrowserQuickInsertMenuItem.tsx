/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
/* eslint-disable @atlaskit/design-system/no-emotion-primitives -- Compiled primitives do not provide Pressable. */
import { Box } from '@atlaskit/primitives/box';
import { Inline } from '@atlaskit/primitives/inline';
import { Pressable } from '@atlaskit/primitives/pressable';
import { Stack } from '@atlaskit/primitives/stack';
import { Text } from '@atlaskit/primitives/text';
import { xcss } from '@atlaskit/primitives/xcss/xcss';
import { token } from '@atlaskit/tokens';

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
	borderRadius: 'radius.medium',
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
		borderRadius: 'radius.medium',
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

const iconColorStyles = css({ color: token('color.icon') });

// Some icons pin a neutral colour inline (for example the Forge and Spotlight icons use
// color.icon.subtle or color.icon.accent.gray), which would ignore the colour set by the menu item.
// Reset only those so every icon follows the menu item (color.icon, or the disabled colour).
// Do NOT widen this to all icon colours: some icons are intentionally coloured (for example skill
// and brand icons that use other --ds-icon-accent-* tokens) and must keep their own colour.
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-important-styles -- Icons pin their colour with an inline style, which only an !important rule on a descendant selector can override. */
const pinnedIconColorResetStyles = css({
	'& [style*="--ds-icon-subtle"], & [style*="--ds-icon-accent-gray"]': {
		color: 'inherit !important',
	},
});
/* eslint-enable @atlaskit/design-system/no-unsafe-design-token-usage, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-important-styles */

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
	titleContent,
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

	// Disabled items keep the dimmed colour inherited from the item.
	const icon = iconBefore ? (
		<span css={[pinnedIconColorResetStyles, !isDisabled && iconColorStyles]}>{iconBefore}</span>
	) : (
		iconBefore
	);

	return (
		<Pressable
			aria-label={ariaLabel}
			aria-selected={isSelected}
			id={id}
			isDisabled={isDisabled}
			onClick={handleClick}
			role="option"
			tabIndex={isSelected ? 0 : -1}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Memoizes composition of module-scoped xcss styles for Pressable.
			xcss={itemStyles}
		>
			{iconBefore && shouldWrapIcon ? (
				<Box
					xcss={isExperimentEnabled('platform_editor_slash_command') ? iconLargeStyles : iconStyles}
				>
					{icon}
				</Box>
			) : (
				icon
			)}
			<Stack space="space.050" grow="fill">
				<Inline alignBlock="center" spread="space-between" space="space.100">
					{titleContent ?? (
						<Text
							color={isDisabled ? 'color.text.disabled' : 'color.text'}
							maxLines={1}
							size="medium"
							weight="medium"
						>
							{title}
						</Text>
					)}
					{shortcut && (
						<Box as="span" xcss={shortcutStyles}>
							{shortcut}
						</Box>
					)}
				</Inline>
				{itemDescription && (
					<Text color="color.text.subtlest" maxLines={2} size="small" weight="regular">
						{itemDescription}
					</Text>
				)}
			</Stack>
		</Pressable>
	);
};
