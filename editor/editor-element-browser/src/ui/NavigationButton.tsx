import React, { useMemo } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';
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

interface ButtonBaseProps {
	id: string;
	mode: 'navigation' | 'expandable';
	label?: string;
	isSelected?: boolean;
	isDisabled?: boolean;
	isExpanded?: boolean;
	attributes?: { new?: boolean };
	xcss?: ReturnType<typeof xcss>;
	onClick?: (id: string) => void;
}

const ButtonBase = ({
	id,
	mode,
	label,
	isSelected,
	isDisabled,
	isExpanded,
	attributes,
	xcss: xcssProp,
	onClick,
}: ButtonBaseProps) => {
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
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						xcssProp,
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

export const LinkNavButton = (props: Omit<ButtonBaseProps, 'mode' | 'isExpanded'>) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<ButtonBase mode="navigation" {...props}></ButtonBase>
);

export const ExpandableNavButton = (props: Omit<ButtonBaseProps, 'mode' | 'isSelected'>) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<ButtonBase mode="expandable" {...props}></ButtonBase>
);

export const BackNavButton = ({ label, onClick }: { label: string; onClick: () => void }) => {
	return (
		<Tooltip content={label} position="top" ignoreTooltipPointerEvents={true}>
			{(tooltipProps) => (
				<IconButton
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...tooltipProps}
					label={label}
					icon={ChevronLeftIcon}
					appearance="subtle"
					spacing="compact"
					onClick={onClick}
				/>
			)}
		</Tooltip>
	);
};
