/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { N0, N20, N30A, N60, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { DatasourceAction } from '../../../../analytics/types';
import type { DisplayViewModes } from '../../../../common/types';
import { useUserInteractions } from '../../../../contexts/user-interactions';
import { DisplayViewDropDown } from '../display-view-dropdown/display-view-drop-down';

import { useViewModeContext } from './useViewModeContext';

export interface ModeSwitcherPropsOption<T extends string = string> {
	label: string;
	value: T;
	disabled?: boolean;
	tooltipText?: string;
}
export interface ModeSwitcherProps<T extends string = string> {
	isCompact?: boolean;
	isDisabled?: boolean;
	options: ModeSwitcherPropsOption<T>[];
	onOptionValueChange: (selectedOptionValue: T) => void;
	selectedOptionValue?: string;
}

const modeSwitcherStyles = css({
	alignItems: 'center',
	backgroundColor: token('color.background.neutral', N20),
	borderRadius: token('space.050', '4px'),
	boxSizing: 'border-box',
	display: 'inline-flex',
	gap: token('space.050', '4px'),
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	'&:disabled': {
		opacity: '0.5',
	},
	marginLeft: token('space.250', '20px'),
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
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.semibold'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	textTransform: 'uppercase',

	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	borderRadius: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
	},
});

const modeSwitcherLabelSelectedStyles = css({
	backgroundColor: token('color.background.input.pressed', N0),
	borderRadius: token('space.050', '4px'),
	boxShadow: token(
		'elevation.shadow.overflow',
		'0px 0px 1px rgba(9, 30, 66, 0.12), 0px 0px 8px rgba(9, 30, 66, 0.16)',
	),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover': {
		cursor: 'pointer',
		backgroundColor: token('color.background.input.pressed', N0),
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
