/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { SplitButtonContextAppearance, SplitButtonSpacing } from './types';

type DividerProps = {
	appearance: SplitButtonContextAppearance;
	spacing: SplitButtonSpacing;
	isDisabled?: boolean;
};

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
		backgroundColor: token('color.border.disabled'),
		cursor: 'not-allowed',
	},
	dividerOffset: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginInline: -1,
	},
});
const dividerAppearanceStyles = cssMap({
	default: {
		backgroundColor: token('color.border'),
	},
	primary: {
		backgroundColor: token('color.border.inverse'),
		opacity: 0.64,
	},
	navigation: {
		height: '16px',
		marginBlock: token('space.100'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginInline: '-0.03125rem', // -0.5px
		backgroundColor: token('color.text.subtle'),
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
const defaultDividerHeightStyles = cssMap({
	default: {
		height: `calc(2rem - ${token('border.width')} - ${token('border.width')})`,
	},
	compact: {
		height: `calc(1.5rem - ${token('border.width')} - ${token('border.width')})`,
	},
});
/**
 * __Divider__
 *
 * A divider component for the SplitButton component.
 *
 * - [Examples](https://atlassian.design/components/button/split-button/examples)
 * - [Code](https://atlassian.design/components/button/split-button/code)
 * - [Usage](https://atlassian.design/components/button/split-button/usage)
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
