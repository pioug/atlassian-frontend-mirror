/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Divider } from './divider';
import { SplitButtonContainer } from './split-button-container';
import { SplitButtonContext } from './split-button-context';
import type { SplitButtonAppearance, SplitButtonSpacing } from './types';

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

type SplitButtonWithSlotsProps = {
	primaryAction: ReactNode;
	secondaryAction: ReactNode;
	appearance?: SplitButtonAppearance;
	spacing?: SplitButtonSpacing;
	isDisabled?: boolean;
};

const SplitButtonWithSlots: ({
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

export default SplitButtonWithSlots;
