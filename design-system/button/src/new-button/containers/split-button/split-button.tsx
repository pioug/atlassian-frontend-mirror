/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type Spacing } from '../../variants/types';

const heights: { [key in Spacing]: string } = {
	default: `${32 / 14}em`,
	compact: `${24 / 14}em`,
	none: 'auto',
};

import { SplitButtonContext } from './split-button-context';
import type {
	SplitButtonAppearance,
	SplitButtonContextAppearance,
	SplitButtonProps,
	SplitButtonSpacing,
} from './types';
import { getActions } from './utils';

const baseDividerStyles = css({
	width: token('border.width'),
	position: 'relative',
	// This is 1 so it appears above buttons by default.
	// When buttons are selected they have a zIndex of 2 applied.
	// See use-button-base.tsx.
	zIndex: 1,
});

const defaultDividerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: heights.default,
});

const compactDividerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: heights.compact,
});

const dividerDisabledStyles = css({
	backgroundColor: token('color.text.disabled', '#091E4224'),
	cursor: 'not-allowed',
	opacity: 0.51,
});

const dividerDisabledRefreshedStyles = css({
	backgroundColor: token('color.border.disabled', '#091E4224'),
	cursor: 'not-allowed',
});

const dividerAppearance: Record<SplitButtonContextAppearance, SerializedStyles> = {
	default: css({
		backgroundColor: token('color.text', '#172B4D'),
		opacity: 0.51,
	}),
	primary: css({
		backgroundColor: token('color.text.inverse', '#FFF'),
		opacity: 0.64,
	}),
	navigation: css({
		height: '16px',
		margin: `${token('space.100', '8px')} -0.5px`,
		backgroundColor: token('color.text.subtle', '#0052cc'),
		opacity: 0.62,
	}),
};

const dividerRefreshedOffsetStyles = css({
	marginInline: `calc(0px - ${token('border.width')})`,
});

const dividerHeight: Record<SplitButtonSpacing, SerializedStyles> = {
	default: defaultDividerStyles,
	compact: compactDividerStyles,
};

type DividerProps = {
	appearance: SplitButtonContextAppearance;
	spacing: SplitButtonSpacing;
	isDisabled?: boolean;
};

/**
 * TODO: Add JSDoc
 */
export const Divider = ({ appearance, spacing, isDisabled = false }: DividerProps) => {
	return (
		// I find it funny to provide a div for Divider
		<div
			css={[
				baseDividerStyles,
				dividerHeight[spacing],
				isDisabled &&
					(fg('platform-component-visual-refresh')
						? dividerDisabledRefreshedStyles
						: dividerDisabledStyles),
				!isDisabled && dividerAppearance[appearance],
				fg('platform-component-visual-refresh') && dividerRefreshedOffsetStyles,
			]}
		/>
	);
};

const splitButtonStyles = css({
	display: 'inline-flex',
	position: 'relative',
	alignItems: 'center',
	whiteSpace: 'nowrap',
});

const primaryButtonStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'button,a': {
		borderEndEndRadius: 0,
		borderStartEndRadius: 0,
	},
});

const secondaryButtonStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'button,a': {
		borderEndStartRadius: 0,
		borderStartStartRadius: 0,
	},
});

const defaultAppearanceContainerStyles = css({
	borderRadius: token('border.radius', '3px'),
	outlineColor: token('color.border'),
	outlineOffset: `calc(0px - ${token('border.width')})`,
	outlineStyle: 'solid',
	outlineWidth: token('border.width'),
});

/**
 * TODO: Add JSdoc
 */
export const SplitButtonContainer = ({
	appearance,
	children,
	isDisabled = false,
}: {
	appearance: SplitButtonAppearance;
	children: ReactNode;
	isDisabled?: boolean;
}) => {
	return (
		<div
			css={[
				appearance === 'default' &&
					!isDisabled &&
					fg('platform-component-visual-refresh') &&
					defaultAppearanceContainerStyles,
				splitButtonStyles,
			]}
		>
			{children}
		</div>
	);
};

/**
 * __Split Button__
 *
 * A split button lets people perform an action or choose from a small group of similar actions.
 *
 * - [Examples](https://atlassian.design/components/button/split-button/examples)
 * - [Code](https://atlassian.design/components/button/split-button/code)
 * - [Usage](https://atlassian.design/components/button/split-button/usage)
 */
export const SplitButton = ({
	children,
	appearance = 'default',
	spacing = 'default',
	isDisabled = false,
}: SplitButtonProps) => {
	const { PrimaryAction, SecondaryAction } = getActions(children);

	return (
		<SplitButtonContainer appearance={appearance} isDisabled={isDisabled}>
			<SplitButtonContext.Provider
				value={{
					appearance,
					spacing,
					isDisabled,
				}}
			>
				<div css={primaryButtonStyles}>{PrimaryAction}</div>
				<Divider appearance={appearance} spacing={spacing} isDisabled={isDisabled} />
				<div css={secondaryButtonStyles}>{SecondaryAction}</div>
			</SplitButtonContext.Provider>
		</SplitButtonContainer>
	);
};

type SplitButtonWithSlotsProps = {
	primaryAction: ReactNode;
	secondaryAction: ReactNode;
	appearance?: SplitButtonAppearance;
	spacing?: SplitButtonSpacing;
	isDisabled?: boolean;
};

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Split button with slots__
 *
 * A split button with slots {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const SplitButtonWithSlots = ({
	primaryAction,
	secondaryAction,
	appearance = 'default',
	spacing = 'default',
	isDisabled = false,
}: SplitButtonWithSlotsProps) => {
	return (
		<SplitButtonContainer appearance={appearance} isDisabled={isDisabled}>
			<SplitButtonContext.Provider
				value={{
					appearance,
					spacing,
					isDisabled,
				}}
			>
				<div css={primaryButtonStyles}>{primaryAction}</div>
				<Divider appearance={appearance} spacing={spacing} isDisabled={isDisabled} />
				<div css={secondaryButtonStyles}>{secondaryAction}</div>
			</SplitButtonContext.Provider>
		</SplitButtonContainer>
	);
};
