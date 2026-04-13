/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { SplitButtonAppearance } from './types';

const buttonStyles = cssMap({
	splitButton: {
		display: 'inline-flex',
		position: 'relative',
		alignItems: 'center',
		whiteSpace: 'nowrap',
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

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Split button container__
 *
 * A split button container {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
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
