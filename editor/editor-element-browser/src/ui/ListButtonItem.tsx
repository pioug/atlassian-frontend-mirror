import React, { memo, useCallback, useMemo, useEffect } from 'react';

import { ToolTipContent, formatShortcut } from '@atlaskit/editor-common/keymaps';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import Lozenge from '@atlaskit/lozenge';
import { ButtonItem } from '@atlaskit/menu';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { ButtonItemProps } from './ButtonItemType';
import { IconRenderer } from './IconRenderer';

const shortcutStyles = xcss({
	color: 'color.text.subtle',
	font: 'font.body.small',
	backgroundColor: 'color.background.accent.gray.subtlest',
	borderRadius: 'radius.small',
	borderStyle: 'none',
});

const selectedColorStyles = xcss({
	color: 'color.text.selected',
});

const disabledShortcutStyles = xcss({
	color: 'color.text.disabled',
	backgroundColor: 'color.background.disabled',
});

const viewAllStyles = xcss({
	background: token('elevation.surface.overlay'),

	position: 'sticky',
	bottom: '-4px',

	width: '100%',
	height: '40px',

	borderTop: `${token('border.width')} solid ${token('color.border')}`,
});

interface ListButtonItemBaseProps extends ButtonItemProps {
	renderContent: () => React.ReactNode;
	renderElementAfter?: () => React.ReactNode;
}

const ListButtonItemBase = memo(
	({
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
		const beforeElement = useMemo(() => {
			if (!renderIcon) {
				return null;
			}
			return <IconRenderer>{renderIcon()}</IconRenderer>;
		}, [renderIcon]);
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
	},
);

export const ListButtonItem = memo((props: ButtonItemProps) => {
	const { keyshortcut, isSelected, isDisabled, attributes, title, setSelectedItem, index } = props;
	const shortcutComponent = useCallback(() => {
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
					isSelected && selectedColorStyles,
					isDisabled && disabledShortcutStyles,
				]}
			>
				{shortcut}
			</Box>
		);
	}, [isDisabled, isSelected, keyshortcut]);

	const contentComponent = useCallback(() => {
		return (
			<Inline space="space.100" alignBlock={'center'}>
				<Text>{title}</Text>
				{attributes?.new && <Lozenge appearance="new">New</Lozenge>}
			</Inline>
		);
	}, [attributes?.new, title]);

	useEffect(() => {
		if (isSelected) {
			setSelectedItem?.({ index });
		}
	}, [isSelected, setSelectedItem, index]);

	return (
		<ListButtonItemBase
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			renderContent={contentComponent}
			renderElementAfter={shortcutComponent}
		/>
	);
});

export interface ViewAllButtonItemProps {
	isViewAllInserts?: boolean;
	label: string;
	onClick: () => void;
}

export const ViewAllButtonItem = memo(
	({ label, onClick, isViewAllInserts = false }: ViewAllButtonItemProps) => {
		const contentComponent = useCallback(() => {
			return (
				<Inline space="space.100" alignBlock={'center'}>
					<Text color={'color.text.selected'}>{label}</Text>
					<Box xcss={[selectedColorStyles]}>
						<ChevronRightIcon label={label} size="small" />
					</Box>
				</Inline>
			);
		}, [label]);

		return isViewAllInserts ? (
			<Box xcss={viewAllStyles}>
				<ListButtonItemBase
					index={-1}
					title={label}
					onItemSelected={onClick}
					renderContent={contentComponent}
					isViewAll={true}
				/>
			</Box>
		) : (
			<ListButtonItemBase
				index={-1}
				title={label}
				onItemSelected={onClick}
				renderContent={contentComponent}
			/>
		);
	},
);
