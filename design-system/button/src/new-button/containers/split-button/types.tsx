import { type ReactNode } from 'react';

// We were extracting from these but ERT wasn't able to render them nicely.
// import type { Appearance, Spacing } from '../../variants/types';

export type SplitButtonAppearance = 'default' | 'primary';

export type SplitButtonContextAppearance = SplitButtonAppearance | 'navigation';

export type SplitButtonSpacing = 'default' | 'compact';

export type SplitButtonProps = {
	/**
	 * Only two children are allowed.
	 * First child is the primary action, second child is the secondary action.
	 * The assumption is that for both children trees there is a button reading the context.
	 */
	children: ReactNode;
	/**
	 * The style variation for child buttons. Will override any appearance set on a child button.
	 */
	appearance?: SplitButtonAppearance;
	/**
	 * Controls the amount of padding in the child buttons.
	 */
	spacing?: SplitButtonSpacing;
	/**
	 * Whether all child buttons should be disabled.
	 */
	isDisabled?: boolean;
};
