/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SplitButtonContext } from './split-button-context';
import type {
	SplitButtonAppearance,
	SplitButtonContextAppearance,
	SplitButtonProps,
	SplitButtonSpacing,
} from './types';
import { getActions } from './utils';

const dividerStyles = cssMap({
	baseDivider: {
		width: token('border.width'),
		position: 'relative',
		// This is 1 so it appears above buttons by default.
		// When buttons are selected they have a zIndex of 2 applied.
		// See use-button-base.tsx.
		zIndex: 1,
	},
	dividerDisabled: {
		backgroundColor: token('color.border.disabled', '#091E4224'),
		cursor: 'not-allowed',
	},
	dividerOffset: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginInline: -1,
	},
});

const dividerAppearanceStyles = cssMap({
	default: {
		backgroundColor: token('color.border', '#091E4224'),
	},
	primary: {
		backgroundColor: token('color.border.inverse', '#FFF'),
		opacity: 0.64,
	},
	navigation: {
		height: '16px',
		marginBlock: token('space.100', '8px'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginInline: '-0.03125rem', // -0.5px
		backgroundColor: token('color.text.subtle', '#0052cc'),
		opacity: 0.62,
	},
});

const dividerHeightStyles = cssMap({
	default: {
		height: '2rem',
	},
	compact: {
		height: '1.5rem',
	},
});

// The divider height is calculated by subtracting twice the border width from the button height.
// This ensures the divider does not intersect with the button's border, avoiding visual issues
// caused by overlapping alpha colors (color.border) at the intersection.
const defaultDividerHeightStyles = cssMap({
	default: {
		height: `calc(2rem - ${token('border.width', '1px')} - ${token('border.width', '1px')})`,
	},
	compact: {
		height: `calc(1.5rem - ${token('border.width', '1px')} - ${token('border.width', '1px')})`,
	},
});

type DividerProps = {
	appearance: SplitButtonContextAppearance;
	spacing: SplitButtonSpacing;
	isDisabled?: boolean;
};

/**
 * TODO: Add JSDoc
 */
export const Divider: ({ appearance, spacing, isDisabled }: DividerProps) => JSX.Element = ({
	appearance,
	spacing,
	isDisabled = false,
}: DividerProps) => {
	const isDefaultDivider = appearance === 'default' && !isDisabled;
	return (
		// I find it funny to provide a div for Divider
		<div
			css={[
				dividerStyles.baseDivider,
				isDefaultDivider && defaultDividerHeightStyles[spacing],
				!isDefaultDivider && dividerHeightStyles[spacing],
				isDisabled && dividerStyles.dividerDisabled,
				!isDisabled && dividerAppearanceStyles[appearance],
				dividerStyles.dividerOffset,
			]}
		/>
	);
};

const buttonStyles = cssMap({
	splitButton: {
		display: 'inline-flex',
		position: 'relative',
		alignItems: 'center',
		whiteSpace: 'nowrap',
	},
	primaryButton: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'button,a': {
			borderEndEndRadius: 0,
			borderStartEndRadius: 0,
		},
	},
	secondaryButton: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'button,a': {
			borderEndStartRadius: 0,
			borderStartStartRadius: 0,
		},
	},
	defaultAppearanceContainer: {
		borderRadius: token('radius.small', '3px'),
		outlineColor: token('color.border'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		outlineOffset: -1,
		outlineStyle: 'solid',
		outlineWidth: 1,
	},
	// platform-dst-shape-theme-default TODO: Merge into defaultAppearanceContainer after rollout
	defaultAppearanceContainerT26Shape: {
		borderRadius: token('radius.medium', '6px'),
	},
	defaultAppearanceDisabledContainer: {
		outlineColor: token('color.border.disabled'),
	},
});

/**
 * TODO: Add JSdoc
 */
export const SplitButtonContainer: ({
	appearance,
	children,
	isDisabled,
}: {
	appearance: SplitButtonAppearance;
	children: ReactNode;
	isDisabled?: boolean;
}) => JSX.Element = ({
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
				appearance === 'default' && buttonStyles.defaultAppearanceContainer,
				appearance === 'default' &&
					fg('platform-dst-shape-theme-default') &&
					buttonStyles.defaultAppearanceContainerT26Shape,
				appearance === 'default' && isDisabled && buttonStyles.defaultAppearanceDisabledContainer,
				buttonStyles.splitButton,
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
export const SplitButton: ({
	children,
	appearance,
	spacing,
	isDisabled,
}: SplitButtonProps) => JSX.Element = ({
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
				<div css={buttonStyles.primaryButton}>{PrimaryAction}</div>
				<Divider appearance={appearance} spacing={spacing} isDisabled={isDisabled} />
				<div css={buttonStyles.secondaryButton}>{SecondaryAction}</div>
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
export const SplitButtonWithSlots: ({
	primaryAction,
	secondaryAction,
	appearance,
	spacing,
	isDisabled,
}: SplitButtonWithSlotsProps) => JSX.Element = ({
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
				<div css={buttonStyles.primaryButton}>{primaryAction}</div>
				<Divider appearance={appearance} spacing={spacing} isDisabled={isDisabled} />
				<div css={buttonStyles.secondaryButton}>{secondaryAction}</div>
			</SplitButtonContext.Provider>
		</SplitButtonContainer>
	);
};
