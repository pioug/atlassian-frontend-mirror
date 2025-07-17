import React, { memo, useMemo } from 'react';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';
import Lozenge from '@atlaskit/lozenge';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Pressable, xcss } from '@atlaskit/primitives';
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
	paddingInline: 'space.100',

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

const headingContainerStyles = xcss({ textAlign: 'left', color: 'color.text.accent.orange' });

interface ButtonBaseProps {
	id: string;
	mode: 'navigation' | 'expandable';
	label?: string;
	isSelected?: boolean;
	isDisabled?: boolean;
	isExpanded?: boolean;
	attributes?: { new?: boolean };
	onClick?: (id: string) => void;
}

const ButtonBase = memo(
	({
		id,
		mode,
		label,
		isSelected,
		isDisabled,
		isExpanded,
		attributes,
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
			return <Icon label={iconLabel} size="small" />;
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
								<Box xcss={headingContainerStyles}>
									<Heading size={'xsmall'} as="span">
										{label}
									</Heading>
								</Box>
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
	},
);

export const LinkNavButton = memo((props: Omit<ButtonBaseProps, 'mode' | 'isExpanded'>) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<ButtonBase mode="navigation" {...props}></ButtonBase>
));

export const ExpandableNavButton = memo((props: Omit<ButtonBaseProps, 'mode' | 'isSelected'>) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<ButtonBase mode="expandable" {...props}></ButtonBase>
));

export const BackNavButton = memo(({ label, onClick }: { label: string; onClick: () => void }) => {
	return (
		<Tooltip content={label} position="top" ignoreTooltipPointerEvents={true}>
			{(tooltipProps) => (
				<IconButton
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...tooltipProps}
					label={label}
					icon={ArrowLeftIcon}
					appearance="subtle"
					spacing="compact"
					onClick={onClick}
				/>
			)}
		</Tooltip>
	);
});
