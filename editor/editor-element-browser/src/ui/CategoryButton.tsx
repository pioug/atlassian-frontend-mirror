import React, { useMemo } from 'react';

import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import ChevronUpIcon from '@atlaskit/icon/utility/chevron-up';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Pressable, Text, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

const buttonStyles = xcss({
	display: 'inline-flex',
	flexShrink: 0,
	boxSizing: 'border-box',
	position: 'relative',
	alignItems: 'baseline',
	justifyContent: 'center',
	textAlign: 'center',
	verticalAlign: 'middle',

	height: 'auto',
	minHeight: 'space.400',
	width: '100%',
	paddingBlock: 'space.075',
	paddingInlineEnd: 'space.300',
	paddingInlineStart: 'space.250',

	borderRadius: 'border.radius.100',
	borderWidth: 'border.width.0',

	font: 'font.body',
	fontWeight: 'font.weight.medium',

	transition: 'opacity 0.3s, background 0.1s ease-out',

	backgroundColor: 'color.background.neutral.subtle',
	color: 'color.text.subtle',

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

export interface CategoryButtonProps {
	id: string;
	mode: 'navigation' | 'expandable';
	label?: string;
	isSelected?: boolean;
	isDisabled?: boolean;
	isExpanded?: boolean;
	attributes?: { new?: boolean };
	onClick?: (id: string) => void;
}

const CategoryButton = ({
	id,
	mode,
	label,
	isSelected,
	isDisabled,
	isExpanded,
	attributes,
	onClick,
}: CategoryButtonProps) => {
	const iconComponent = useMemo(() => {
		let Icon: typeof ChevronUpIcon | typeof ChevronDownIcon | typeof ChevronRightIcon;
		let iconLabel: string;
		switch (mode) {
			case 'expandable':
				Icon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
				iconLabel = isExpanded ? `Collapse ${label} inserts` : `Expand ${label} inserts`;
				break;
			default:
				Icon = ChevronRightIcon;
				iconLabel = `View all ${label} inserts`;
		}
		return <Icon label={iconLabel} />;
	}, [isExpanded, label, mode]);

	return (
		<Tooltip content={label} position="top" ignoreTooltipPointerEvents={true}>
			{(tooltipProps) => (
				<Pressable
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...tooltipProps}
					type="button"
					isDisabled={isDisabled}
					onClick={() => onClick?.(id)}
					xcss={[
						buttonStyles,
						isSelected && selectedButtonStyles,
						isDisabled && disabledButtonStyles,
					]}
				>
					<Inline
						as="span"
						spread="space-between"
						alignBlock="center"
						space={'space.100'}
						grow="fill"
						shouldWrap={false}
					>
						<Inline alignBlock="center" space="space.100" shouldWrap={false}>
							<Text
								align="start"
								maxLines={1}
								color={
									isDisabled
										? 'color.text.disabled'
										: isSelected
											? 'color.text.selected'
											: 'color.text.accent.gray.bolder'
								}
								size="medium"
								weight="medium"
							>
								{label}
							</Text>
							{attributes?.new && (
								<Box>
									<Lozenge appearance="new">New</Lozenge>
								</Box>
							)}
						</Inline>
						<Box>{iconComponent}</Box>
					</Inline>
				</Pressable>
			)}
		</Tooltip>
	);
};

export const NavCategoryButton = (props: Omit<CategoryButtonProps, 'mode' | 'isExpanded'>) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<CategoryButton mode="navigation" {...props}></CategoryButton>
);

export const ExpandableCategoryButton = (
	props: Omit<CategoryButtonProps, 'mode' | 'isSelected'>,
) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<CategoryButton mode="expandable" {...props}></CategoryButton>
);
