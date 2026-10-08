/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useId, useMemo, useState } from 'react';

import { css } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- Compiled primitives do not provide Pressable.
import { Pressable, xcss } from '@atlaskit/primitives';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { QuickInsertHoverPreview } from './QuickInsertHoverPreview';
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
	description,
	iconBefore,
	isDisabled,
	onSelect,
	preview,
	previewIcon,
	previewImageUrls,
	shortcut,
	titleContent,
	shouldShowPreview = true,
	shouldClampPreview,
	shouldWrapIcon = true,
	title,
}: QuickInsertMenuItemProps): React.JSX.Element => {
	const { item, popupsMountPoint } = useQuickInsertContext();
	const { id, isPreviewActive, isSelected } = item ?? {
		id: undefined,
		isPreviewActive: undefined,
		isSelected: false,
	};
	const resolvedDescription = description ?? item?.description;
	const previewId = useId();
	const handleClick = useQuickInsertMenuItemSelection(onSelect);
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
	const resolvedPreview = useMemo(
		() => preview ?? (previewImageUrls ? { image: previewImageUrls } : {}),
		[preview, previewImageUrls],
	);
	const shouldRenderPreview = shouldShowPreview && (isPreviewActive ?? isSelected) && !isDisabled;
	const hasAccessiblePreview = Boolean(resolvedDescription || resolvedPreview?.attribution);
	const previewAttributionName = resolvedPreview.attribution?.name;
	const previewAttributionKey =
		typeof previewAttributionName === 'string'
			? previewAttributionName
			: previewAttributionName?.id;

	const wrappedIcon =
		iconBefore && shouldWrapIcon ? <Box xcss={styles.iconLarge}>{iconBefore}</Box> : iconBefore;

	return (
		<React.Fragment>
			<Pressable
				ref={setReferenceElement}
				aria-label={ariaLabel}
				aria-describedby={shouldRenderPreview && hasAccessiblePreview ? previewId : undefined}
				aria-selected={isSelected}
				id={id}
				isDisabled={isDisabled}
				onClick={handleClick}
				role="option"
				xcss={isDisabled ? disabledItemStyles : isSelected ? selectedItemStyles : itemStyles}
			>
				{wrappedIcon && (
					<Box xcss={styles.iconContainer}>
						<span css={[pinnedIconColorResetStyles, !isDisabled && iconColorStyles]}>
							{wrappedIcon}
						</span>
					</Box>
				)}
				<Inline alignBlock="center" spread="space-between" xcss={styles.content}>
					{titleContent ?? (
						<Text color={isDisabled ? 'color.text.disabled' : 'color.text'}>{title}</Text>
					)}
					{shortcut && (
						<Box as="span" xcss={styles.shortcut}>
							{shortcut}
						</Box>
					)}
				</Inline>
			</Pressable>
			{shouldRenderPreview && referenceElement && (
				<QuickInsertHoverPreview
					key={resolvedPreview.image?.light ?? previewAttributionKey ?? title}
					id={previewId}
					description={resolvedDescription}
					preview={resolvedPreview}
					popupsMountPoint={popupsMountPoint}
					referenceElement={referenceElement}
					title={title}
					icon={previewIcon}
					shouldClampText={shouldClampPreview}
				/>
			)}
		</React.Fragment>
	);
};
