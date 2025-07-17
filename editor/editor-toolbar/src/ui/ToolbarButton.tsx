import React, { forwardRef, type ReactNode, type Ref } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { type TriggerProps } from '@atlaskit/popup';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type IconComponent, type ToolbarButtonGroupLocation } from '../types';

const styles = cssMap({
	button: {
		display: 'flex',
		gap: token('space.075'),
		backgroundColor: token('color.background.neutral.subtle'),
		whiteSpace: 'nowrap',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('border.radius.100'),
		minHeight: '32px',
		color: token('color.text.subtle'),
		fontWeight: token('font.weight.medium'),
		paddingLeft: token('space.100'),
		paddingRight: token('space.100'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},

		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	selected: {
		backgroundColor: token('color.background.selected'),

		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},

		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
	groupStart: {
		borderTopRightRadius: '0px',
		borderBottomRightRadius: '0px',
		justifyContent: 'flex-end',
		paddingLeft: token('space.075'),
		paddingRight: token('space.025'),
	},
	groupMiddle: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		borderTopRightRadius: '0px',
		borderBottomRightRadius: '0px',
		paddingLeft: token('space.050'),
		paddingRight: token('space.050'),
	},
	groupEnd: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		justifyContent: 'flex-start',
		paddingLeft: token('space.025'),
		paddingRight: token('space.075'),
	},
});

type ToolbarButtonProps = Partial<TriggerProps> & {
	children?: ReactNode;
	isSelected?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	testId?: string;
	label: string;
	icon: IconComponent;
	groupLocation?: ToolbarButtonGroupLocation;
};

export const ToolbarButton = forwardRef(
	(
		{
			icon: IconComponent,
			label,
			children,
			onClick,
			isSelected,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
			'aria-controls': ariaControls,
			'data-ds--level': dataDsLevel,
			onBlur,
			onFocus,
			testId,
			groupLocation,
		}: ToolbarButtonProps,
		ref: Ref<HTMLButtonElement>,
	) => {
		return (
			<Pressable
				ref={ref}
				xcss={cx(
					styles.button,
					isSelected && styles.selected,
					groupLocation === 'start' && styles.groupStart,
					groupLocation === 'middle' && styles.groupMiddle,
					groupLocation === 'end' && styles.groupEnd,
				)}
				aria-expanded={ariaExpanded}
				aria-haspopup={ariaHasPopup}
				aria-controls={ariaControls}
				data-ds--level={dataDsLevel}
				onClick={onClick}
				onBlur={onBlur}
				onFocus={onFocus}
				testId={testId}
			>
				<IconComponent
					label={label}
					size="medium"
					color={isSelected ? token('color.icon.selected') : token('color.icon.subtle')}
				/>
				{children}
			</Pressable>
		);
	},
);
