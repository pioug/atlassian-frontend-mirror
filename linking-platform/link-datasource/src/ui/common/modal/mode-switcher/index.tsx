/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { N30A, N60, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { DatasourceAction } from '../../../../analytics/types';
import type { DisplayViewModes } from '../../../../common/types';
import { useUserInteractions } from '../../../../contexts/user-interactions';
import { DisplayViewDropDown } from '../display-view-dropdown/display-view-drop-down';

import { useViewModeContext } from './useViewModeContext';

export interface ModeSwitcherPropsOption<T extends string = string> {
	disabled?: boolean;
	label: string;
	tooltipText?: string;
	value: T;
}
export interface ModeSwitcherProps<T extends string = string> {
	isCompact?: boolean;
	isDisabled?: boolean;
	onOptionValueChange: (selectedOptionValue: T) => void;
	options: ModeSwitcherPropsOption<T>[];
	selectedOptionValue?: string;
}

const modeSwitcherStyles = css({
	alignItems: 'center',
	borderRadius: token('space.050', '4px'),
	boxSizing: 'border-box',
	display: 'inline-flex',
	paddingRight: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	'&:disabled': {
		opacity: '0.5',
	},
	marginLeft: token('space.250', '20px'),
	borderColor: token('color.border'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	height: '32px',
});

const compactModeSwitcherStyles = css({
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	gap: token('space.025', '2px'),
});

const modeInputStyles = css({
	display: 'none',
});

const modeSwitcherLabelStyles = css({
	color: token('color.text.subtlest', N700),
	boxSizing: 'border-box',
	font: token('font.body'),
	fontWeight: token('font.weight.medium'),

	paddingRight: token('space.150', '12px'),
	paddingLeft: token('space.150', '12px'),
	borderRadius: token('space.050', '4px'),
	minHeight: '24px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderColor: 'transparent',
	borderWidth: token('border.width'),
	borderStyle: 'solid',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
	},
});

const modeSwitcherLabelSelectedStyles = css({
	backgroundColor: token('color.background.selected'),
	borderRadius: token('space.050', '4px'),
	borderColor: token('color.border.selected'),
	color: token('color.text.selected'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.selected'),
	},
});

const modeSwitcherLabelDisabledStyles = css({
	color: token('color.text.disabled', N60),
});

const modeSwitcherDisabledStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		cursor: 'not-allowed',
		background: 'transparent',
	},
});

const compactModeSwitcherLabelStyles = css({
	paddingTop: token('space.025', '2px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.050', '4px'),
});

export const ModeSwitcher = <T extends string = string>(props: ModeSwitcherProps<T>) => {
	const {
		isCompact,
		isDisabled,
		onOptionValueChange,
		options,
		selectedOptionValue = options[0]?.value,
	} = props;

	const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onOptionValueChange(event.currentTarget.value as T);
	};

	return options.length > 0 ? (
		<fieldset
			css={[modeSwitcherStyles, isCompact && compactModeSwitcherStyles]}
			data-testid="mode-toggle-container"
			disabled={isDisabled}
		>
			{options.map(({ value, label, disabled: isOptionDisabled, tooltipText }) => {
				const isSelected = value === selectedOptionValue;

				return (
					<Tooltip key={value} content={tooltipText}>
						{(tooltipProps) => (
							<label
								{...tooltipProps}
								key={value}
								css={[
									modeSwitcherLabelStyles,
									isCompact && compactModeSwitcherLabelStyles,
									isSelected && modeSwitcherLabelSelectedStyles,
									isDisabled && modeSwitcherDisabledStyles,
									isOptionDisabled && modeSwitcherLabelDisabledStyles,
									isOptionDisabled && modeSwitcherDisabledStyles,
								]}
								data-testid={`mode-toggle-${value}`}
							>
								{label}
								{/* eslint-disable-next-line @atlaskit/design-system/no-html-radio */}
								<input
									aria-checked={isSelected}
									aria-disabled={isOptionDisabled}
									checked={isSelected}
									css={modeInputStyles}
									disabled={isOptionDisabled}
									onChange={handleModeChange}
									type="radio"
									value={value}
								/>
							</label>
						)}
					</Tooltip>
				);
			})}
		</fieldset>
	) : null;
};

export const DatasourceViewModeDropDown = () => {
	const userInteractions = useUserInteractions();
	const { currentViewMode, setCurrentViewMode, disableDisplayDropdown } = useViewModeContext();
	if (disableDisplayDropdown) {
		return null;
	}

	const handleViewModeChange = (selectedMode: DisplayViewModes) => {
		userInteractions.add(DatasourceAction.DISPLAY_VIEW_CHANGED);
		setCurrentViewMode(selectedMode);
	};

	return <DisplayViewDropDown onViewModeChange={handleViewModeChange} viewMode={currentViewMode} />;
};
