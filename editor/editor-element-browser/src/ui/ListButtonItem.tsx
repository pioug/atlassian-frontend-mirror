import React, { useCallback, useMemo } from 'react';

import { ToolTipContent, formatShortcut } from '@atlaskit/editor-common/keymaps';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import Lozenge from '@atlaskit/lozenge';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import type { ButtonItemProps } from './ButtonItemType';

const shortcutStyles = xcss({
	color: 'color.text.subtle',
	font: 'font.body.small',
	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: 'border.radius',
	borderStyle: 'none',
});

const selectedColorStyles = xcss({
	color: 'color.text.selected',
});

const disabledShortcutStyles = xcss({
	color: 'color.text.disabled',
	backgroundColor: 'color.background.disabled',
});

interface ListButtonItemBaseProps extends ButtonItemProps {
	renderContent: () => React.ReactNode;
	renderElementAfter?: () => React.ReactNode;
}

const ListButtonItemBase = ({
	index,
	title,
	description,
	keyshortcut,
	isSelected,
	isDisabled,
	showDescription = false,
	renderContent,
	renderIcon,
	renderElementAfter,
	onItemSelected,
}: ListButtonItemBaseProps) => {
	const beforeElement = useMemo(() => renderIcon?.(), [renderIcon]);
	const afterElement = useMemo(() => renderElementAfter?.(), [renderElementAfter]);
	const content = useMemo(() => renderContent?.(), [renderContent]);

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
					iconBefore={beforeElement}
					iconAfter={afterElement}
					description={showDescription ? description : undefined}
					shouldDescriptionWrap
					isSelected={isSelected}
					isDisabled={isDisabled}
					onClick={() => onItemSelected?.(index)}
				>
					{content}
				</ButtonItem>
			)}
		</Tooltip>
	);
};

export const ListButtonItem = (props: ButtonItemProps) => {
	const shortcutComponent = useCallback(() => {
		const shortcut = props.keyshortcut && formatShortcut(props.keyshortcut);
		if (!shortcut) {
			return null;
		}
		return (
			<Box
				paddingInline="space.025"
				paddingBlock="space.025"
				xcss={[
					shortcutStyles,
					props.isSelected && selectedColorStyles,
					props.isDisabled && disabledShortcutStyles,
				]}
			>
				{shortcut}
			</Box>
		);
	}, [props.isDisabled, props.isSelected, props.keyshortcut]);

	const contentComponent = useCallback(() => {
		return (
			<Inline space="space.100" alignBlock={'center'}>
				<Text>{props.title}</Text>
				{props.attributes?.new && <Lozenge appearance="new">New</Lozenge>}
			</Inline>
		);
	}, [props.attributes?.new, props.title]);

	return (
		<ListButtonItemBase
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			renderContent={contentComponent}
			renderElementAfter={shortcutComponent}
		/>
	);
};

export interface ViewAllButtonItemProps {
	label: string;
	onClick: () => void;
}

export const ViewAllButtonItem = ({ label, onClick }: ViewAllButtonItemProps) => {
	const contentComponent = useCallback(() => {
		return (
			<Inline space="space.100" alignBlock={'center'}>
				<Text color={'color.text.selected'}>{label}</Text>
				<Box xcss={[selectedColorStyles]}>
					<ChevronRightIcon label={label} />
				</Box>
			</Inline>
		);
	}, [label]);

	return (
		<ListButtonItemBase
			index={-1}
			title={label}
			onItemSelected={onClick}
			renderContent={contentComponent}
		/>
	);
};
