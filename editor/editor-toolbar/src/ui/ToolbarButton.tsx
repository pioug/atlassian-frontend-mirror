import React, { forwardRef, type ReactNode, type Ref } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { type TriggerProps } from '@atlaskit/popup';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useToolbarUI } from '../hooks/ui-context';

const styles = cssMap({
	button: {
		display: 'flex',
		gap: token('space.075'),
		backgroundColor: token('color.background.neutral.subtle'),
		whiteSpace: 'nowrap',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('radius.small'),
		minHeight: '28px',
		color: token('color.text.subtle'),
		font: token('font.body'),
		paddingLeft: token('space.100'),
		paddingRight: token('space.100'),
		'&:focus-visible': {
			outlineOffset: '0',
			zIndex: 1,
			position: 'relative',
		},
	},
	enabled: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	disabled: {
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
});

type ToolbarButtonProps = Partial<TriggerProps> & {
	ariaKeyshortcuts?: string;
	children?: ReactNode;
	iconBefore: React.ReactNode;
	interactionName?: string;
	isDisabled?: boolean;
	isSelected?: boolean;
	label?: string;
	onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	testId?: string;
};

export const ToolbarButton = forwardRef(
	(
		{
			iconBefore,
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
			isDisabled,
			ariaKeyshortcuts,
			label,
			interactionName,
		}: ToolbarButtonProps,
		ref: Ref<HTMLButtonElement>,
	) => {
		const { preventDefaultOnMouseDown, isDisabled: ctxDisabled } = useToolbarUI();
		const disabled = Boolean(ctxDisabled || isDisabled);

		return (
			<Pressable
				ref={ref}
				xcss={cx(
					styles.button,
					disabled ? styles.disabled : isSelected ? styles.selected : styles.enabled,
				)}
				aria-pressed={isSelected}
				aria-expanded={ariaExpanded}
				aria-haspopup={ariaHasPopup}
				aria-controls={ariaControls}
				aria-keyshortcuts={ariaKeyshortcuts}
				aria-label={label}
				data-ds--level={dataDsLevel}
				onClick={onClick}
				onBlur={onBlur}
				onFocus={onFocus}
				testId={testId}
				isDisabled={disabled}
				onMouseDown={(event) => {
					if (preventDefaultOnMouseDown) {
						event.preventDefault();
					}
				}}
				data-toolbar-component="button"
				interactionName={interactionName}
			>
				{iconBefore}
				{children}
			</Pressable>
		);
	},
);
