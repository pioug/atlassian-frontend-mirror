/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

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
		borderRadius: token('radius.medium'),
		outlineColor: token('color.border'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		outlineOffset: -1,
		outlineStyle: 'solid',
		outlineWidth: 1,
	},
	defaultAppearanceDisabledContainer: {
		outlineColor: token('color.border.disabled'),
	},
});

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
}) => (
	<div
		css={[
			appearance === 'default' && buttonStyles.defaultAppearanceContainer,
			appearance === 'default' && isDisabled && buttonStyles.defaultAppearanceDisabledContainer,
			buttonStyles.splitButton,
		]}
	>
		{children}
	</div>
);
