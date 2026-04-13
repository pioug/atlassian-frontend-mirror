/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Divider } from './divider';
import { SplitButtonContainer } from './split-button-container';
import { SplitButtonContext } from './split-button-context';
import type { SplitButtonProps } from './types';
import { getActions } from './utils';

const buttonStyles = cssMap({
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
});

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
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
