import React, { forwardRef, memo, useMemo, type Ref } from 'react';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Pressable, Stack, Text, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import type { ButtonItemProps } from './ButtonItemType';
import { IconRenderer } from './IconRenderer';

const WIDTH = '60px';

const largeButtonStyles = xcss({
	display: 'inline-flex',
	flexShrink: 0,
	boxSizing: 'border-box',
	position: 'relative',
	alignItems: 'baseline',
	justifyContent: 'center',
	textAlign: 'center',
	verticalAlign: 'middle',

	height: `${WIDTH}`, // The width and height of the button are the same for it to appear as square
	width: `${WIDTH}`,

	borderRadius: 'border.radius.100',
	borderWidth: 'border.width.0',

	font: 'font.body',
	fontWeight: 'font.weight.medium',

	transition: 'opacity 0.3s, background 0.1s ease-out',

	backgroundColor: 'color.background.neutral.subtle',
	color: 'color.text.subtle',

	'::after': {
		position: 'absolute',
		inset: 'space.0',
		content: '""',

		borderRadius: 'inherit',
		borderStyle: 'solid',
		borderWidth: 'border.width',
		borderColor: 'color.border',

		pointerEvents: 'none',
	},

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
		color: 'color.text.subtle',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
		color: 'color.text.subtle',
	},
});

const selectedButtonStyles = xcss({
	backgroundColor: 'color.background.selected',
	color: 'color.text.selected',
	'::after': {
		content: '""',
		borderColor: 'color.border.selected',
	},
	':visited': {
		color: 'color.text.selected',
	},
	':hover': {
		color: 'color.text.selected',
		backgroundColor: 'color.background.selected.hovered',
	},
	':active': {
		color: 'color.text.selected',
		backgroundColor: 'color.background.selected.pressed',
	},
});

const disabledButtonStyles = xcss({
	cursor: 'not-allowed',
	backgroundColor: 'color.background.disabled',
	color: 'color.text.disabled',
	':hover': {
		backgroundColor: 'color.background.disabled',
		color: 'color.text.disabled',
	},
	':active': {
		backgroundColor: 'color.background.disabled',
		color: 'color.text.disabled',
	},
	'::after': {
		content: 'none',
	},
});

const iconStyles = xcss({
	display: 'flex',
	flexGrow: 0,
	flexShrink: 0,
	alignSelf: 'center',
	userSelect: 'none',
});

const textStyles = xcss({
	width: `${WIDTH}`,
});

type LargeIconButtonProps = {
	icon?: React.ReactNode;
	isDisabled?: boolean;
	isSelected?: boolean;
	onClick?: () => void;
};

const LargeIconButtonWithRef = memo(
	forwardRef<HTMLElement, LargeIconButtonProps>(
		({ icon, isSelected, isDisabled, onClick, ...rest }: LargeIconButtonProps, ref) => {
			return (
				<Pressable
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...rest}
					ref={ref as Ref<HTMLButtonElement>}
					type="button"
					isDisabled={isDisabled}
					onClick={onClick}
					xcss={[
						largeButtonStyles,
						isSelected && selectedButtonStyles,
						isDisabled && disabledButtonStyles,
					]}
				>
					<Box as="span" xcss={iconStyles}>
						{icon}
					</Box>
				</Pressable>
			);
		},
	),
);

export const IconButtonItem = memo(
	({
		index,
		title,
		keyshortcut,
		isSelected,
		isDisabled,
		renderIcon,
		onItemSelected,
	}: ButtonItemProps) => {
		const iconComponent = useMemo(() => {
			if (!renderIcon) {
				return null;
			}
			return <IconRenderer>{renderIcon()}</IconRenderer>;
		}, [renderIcon]);

		return (
			<Tooltip
				content={<ToolTipContent description={title} keymap={keyshortcut} />}
				position="top"
				ignoreTooltipPointerEvents={true}
			>
				{(tooltipProps) => (
					<Stack alignInline="center" space="space.050">
						<LargeIconButtonWithRef
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...tooltipProps}
							icon={iconComponent}
							isSelected={isSelected}
							isDisabled={isDisabled}
							onClick={() => onItemSelected?.(index)}
						/>
						<Box xcss={textStyles}>
							<Text
								align="center"
								maxLines={1}
								color={
									isDisabled
										? 'color.text.disabled'
										: isSelected
											? 'color.text.selected'
											: 'color.text.subtle'
								}
								size="small"
							>
								{title}
							</Text>
						</Box>
					</Stack>
				)}
			</Tooltip>
		);
	},
);
