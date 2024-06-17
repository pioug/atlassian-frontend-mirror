/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N0, N20, N30A, N60, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

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
	background: token('color.background.neutral', N20),
	borderRadius: token('space.050', '4px'),
	boxSizing: 'border-box',
	display: 'inline-flex',
	gap: token('space.050', '4px'),
	lineHeight: token('space.200', '16px'),
	padding: token('space.050', '4px'),
	'&:disabled': {
		opacity: '0.5',
	},
	marginLeft: token('space.250', '20px'),
});

const compactModeSwitcherStyles = css({
	padding: token('space.050', '4px'),
	gap: token('space.025', '2px'),
});

const modeInputStyles = css({
	display: 'none',
});

const modeSwitcherLabelStyles = css({
	color: token('color.text.subtlest', N700),
	fontSize: token('space.150', '12px'),
	fontWeight: '600',
	textTransform: 'uppercase',

	padding: `${token('space.050', '4px')}`,
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
	padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
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
									isOptionDisabled && [modeSwitcherLabelDisabledStyles, modeSwitcherDisabledStyles],
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
