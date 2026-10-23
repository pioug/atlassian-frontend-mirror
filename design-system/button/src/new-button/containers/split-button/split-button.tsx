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
		// Skips top-layer surfaces. See top-layer/notes/decisions/top-layer-unsafe-selectors.md
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& button:not(:where([popover], dialog, & :is([popover], dialog) *)), & a:not(:where([popover], dialog, & :is([popover], dialog) *))':
			{
				borderEndEndRadius: 0,
				borderStartEndRadius: 0,
			},
	},
	secondaryButton: {
		// Skips top-layer surfaces. See top-layer/notes/decisions/top-layer-unsafe-selectors.md
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& button:not(:where([popover], dialog, & :is([popover], dialog) *)), & a:not(:where([popover], dialog, & :is([popover], dialog) *))':
			{
				borderEndStartRadius: 0,
				borderStartStartRadius: 0,
			},
	},
});

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
