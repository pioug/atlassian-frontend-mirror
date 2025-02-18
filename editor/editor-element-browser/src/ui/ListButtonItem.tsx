import React, { useMemo } from 'react';

import {
	Keymap,
	TooltipContentWithMultipleShortcuts,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import Lozenge from '@atlaskit/lozenge';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ButtonItemProps } from './ButtonItemType';

const Shortcut = ({ keyshortcut }: { keyshortcut?: Keymap }) => {
	const shortcut = keyshortcut && formatShortcut(keyshortcut);
	if (!shortcut) {
		return null;
	}
	return (
		<Box paddingInline="space.025" paddingBlock="space.025" xcss={shortcutStyles}>
			{shortcut}
		</Box>
	);
};

export interface ListButtonItemProps extends ButtonItemProps {
	showDescription?: boolean;
}

export const ListButtonItem = ({
	index,
	title,
	description,
	keyshortcut,
	isSelected,
	attributes,
	showDescription = false,
	renderIcon,
	onItemSelected,
}: ListButtonItemProps) => {
	const iconComponent = useMemo(() => renderIcon?.(), [renderIcon]);
	const shortcutComponent = useMemo(() => {
		return <Shortcut keyshortcut={keyshortcut} />;
	}, [keyshortcut]);

	const content = useMemo(() => {
		return (
			<Inline space="space.100" alignBlock={'center'}>
				{title}
				{attributes?.new && (
					<Lozenge
						style={{
							color: `${token('color.text.accent.gray.bolder')}`,
							backgroundColor: `${token('color.background.accent.blue.subtle')}`,
						}}
					>
						New
					</Lozenge>
				)}
			</Inline>
		);
	}, [attributes?.new, title]);

	const helpDescriptors = [{ description: `${title}`, keymap: keyshortcut }];

	return (
		<Tooltip
			content={<TooltipContentWithMultipleShortcuts helpDescriptors={helpDescriptors} />}
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
					onClick={() => onItemSelected?.(index)}
				>
					{content}
				</ButtonItem>
			)}
		</Tooltip>
	);
};

const shortcutStyles = xcss({
	color: 'color.text.subtle',
	font: 'font.body.small',
	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: 'border.radius',
	borderStyle: 'none',
});
