/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useId, useMemo } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
/* eslint-disable @atlaskit/design-system/no-emotion-primitives -- Compiled primitives do not provide Pressable. */
import { Box } from '@atlaskit/primitives/box';
import { Pressable } from '@atlaskit/primitives/pressable';
import { xcss } from '@atlaskit/primitives/xcss/xcss';
import { token } from '@atlaskit/tokens';

import type { QuickInsertMenuItemProps } from './QuickInsertMenuItem';
import { useQuickInsertMenuItemSelection } from './quickInsertMenuItemUtils';
import { QuickInsertPreviewContent } from './QuickInsertPreviewContent';
import { useQuickInsertContext } from './useQuickInsertContext';

const cardStyles = xcss({
	backgroundColor: 'elevation.surface',
	borderColor: 'color.border',
	borderRadius: 'radius.large',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	color: 'color.text',
	cursor: 'pointer',
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.100',
	// Fills the grid row so every tile in a row is as tall as the tallest one.
	height: '100%',
	padding: 'space.150',
	textAlign: 'start',
	width: '100%',
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
	},
});

// Each state is a complete style so the tile can pick one without composing styles at render.
const selectedCardStyles = xcss({
	backgroundColor: 'color.background.selected',
	borderColor: 'color.border.selected',
	borderRadius: 'radius.large',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	color: 'color.text',
	cursor: 'pointer',
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.100',
	height: '100%',
	padding: 'space.150',
	textAlign: 'start',
	width: '100%',
	':hover': {
		backgroundColor: 'color.background.selected.hovered',
	},
	// Keyboard focus draws the focus ring, so drop the selected border to avoid a double outline.
	':focus-visible': {
		borderColor: 'color.border',
	},
});

const disabledCardStyles = xcss({
	backgroundColor: 'elevation.surface',
	borderColor: 'color.border',
	borderRadius: 'radius.large',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	color: 'color.text.disabled',
	cursor: 'not-allowed',
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.100',
	height: '100%',
	padding: 'space.150',
	textAlign: 'start',
	width: '100%',
});

const iconStyles = xcss({
	alignItems: 'center',
	backgroundColor: 'elevation.surface.overlay',
	borderColor: 'color.border',
	borderRadius: 'radius.large',
	borderStyle: 'solid',
	borderWidth: 'border.width',
	display: 'flex',
	flexShrink: 0,
	height: '32px',
	justifyContent: 'center',
	overflow: 'hidden',
	width: '32px',
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

/**
 * An Element Browser tile: the item's hover preview card (image, title, full description, and
 * attribution), with its shortcut beside the title. Items without a preview image show their icon,
 * always in a bordered box, above the title instead. The hover card's small title icon
 * (`previewIcon`) is not shown, so a tile never repeats its icon.
 */
export const ElementBrowserQuickInsertMenuItem = ({
	ariaLabel,
	description,
	iconBefore,
	isDisabled = false,
	lozenge,
	onSelect,
	preview,
	previewImageUrls,
	shortcut,
	titleContent,
	title,
}: QuickInsertMenuItemProps): React.JSX.Element => {
	const { item } = useQuickInsertContext();
	const { id, isSelected } = item ?? { id: undefined, isSelected: false };
	const itemDescription = description ?? item?.description;
	const handleClick = useQuickInsertMenuItemSelection(onSelect);
	const descriptionId = useId();
	const resolvedPreview = useMemo(
		() => preview ?? (previewImageUrls ? { image: previewImageUrls } : {}),
		[preview, previewImageUrls],
	);
	const hasDescription = Boolean(itemDescription || resolvedPreview.attribution || shortcut);
	const icon = iconBefore ? (
		<span css={[pinnedIconColorResetStyles, !isDisabled && iconColorStyles]}>{iconBefore}</span>
	) : undefined;

	return (
		<Pressable
			aria-describedby={hasDescription ? descriptionId : undefined}
			aria-label={ariaLabel ?? title}
			aria-selected={isSelected}
			id={id}
			isDisabled={isDisabled}
			onClick={handleClick}
			role="option"
			tabIndex={isSelected ? 0 : -1}
			xcss={isDisabled ? disabledCardStyles : isSelected ? selectedCardStyles : cardStyles}
		>
			{!resolvedPreview.image && icon && <Box xcss={iconStyles}>{icon}</Box>}
			<QuickInsertPreviewContent
				description={itemDescription}
				id={hasDescription ? descriptionId : undefined}
				isDisabled={isDisabled}
				lozenge={lozenge}
				preview={resolvedPreview}
				shortcut={shortcut}
				shouldClampText={false}
				title={titleContent ?? title}
			/>
		</Pressable>
	);
};
