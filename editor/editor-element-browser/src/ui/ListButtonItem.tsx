import React, { useMemo } from 'react';

import { ToolTipContent, formatShortcut } from '@atlaskit/editor-common/keymaps';
import Lozenge from '@atlaskit/lozenge';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { ButtonItemProps } from './ButtonItemType';

const shortcutStyles = xcss({
	color: 'color.text.subtle',
	font: 'font.body.small',
	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: 'border.radius',
	borderStyle: 'none',
});

const selectedShortcutStyles = xcss({
	color: 'color.text.selected',
});

const disabledShortcutStyles = xcss({
	color: 'color.text.disabled',
	backgroundColor: 'color.background.disabled',
});

export const ListButtonItem = ({
	index,
	title,
	description,
	keyshortcut,
	isSelected,
	isDisabled,
	attributes,
	showDescription = false,
	renderIcon,
	onItemSelected,
}: ButtonItemProps) => {
	const iconComponent = useMemo(() => renderIcon?.(), [renderIcon]);

	const shortcutComponent = useMemo(() => {
		const shortcut = keyshortcut && formatShortcut(keyshortcut);
		if (!shortcut) {
			return null;
		}
		return (
			<Box
				paddingInline="space.025"
				paddingBlock="space.025"
				xcss={[
					shortcutStyles,
					isSelected && selectedShortcutStyles,
					isDisabled && disabledShortcutStyles,
				]}
			>
				{shortcut}
			</Box>
		);
	}, [isDisabled, isSelected, keyshortcut]);

	const contentComponent = useMemo(() => {
		return (
			<Inline space="space.100" alignBlock={'center'}>
				{title}
				{attributes?.new && <Lozenge appearance="new">New</Lozenge>}
			</Inline>
		);
	}, [attributes?.new, title]);

	return (
		<Tooltip
			content={<ToolTipContent description={title} keymap={keyshortcut} />}
			position="top"
			ignoreTooltipPointerEvents={true}
		>
			{(tooltipProps) => (
				<ButtonItem
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...tooltipProps}
					iconBefore={iconComponent}
					iconAfter={shortcutComponent}
					description={showDescription ? description : undefined}
					shouldDescriptionWrap
					isSelected={isSelected}
					isDisabled={isDisabled}
					onClick={() => onItemSelected?.(index)}
				>
					{contentComponent}
				</ButtonItem>
			)}
		</Tooltip>
	);
};
