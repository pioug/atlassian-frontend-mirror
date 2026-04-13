import { useContext } from 'react';

import { SplitButtonContext } from './split-button-context';
import type { SplitButtonAppearance, SplitButtonSpacing } from './types';

type UseSplitButtonContext = {
	appearance: SplitButtonAppearance | 'subtle';
	spacing: SplitButtonSpacing;
	isDisabled: boolean;
	/**
	 * isSelected state has limited relevance (e.g. dropdown-menu trigger button).
	 * There is no isSelected state for color variants (e.g. primary, danger, warning).
	 * Hens we provide ability to override the isSelected state with isActiveOverSelected to display `active` state instead of `selected` state.
	 */
	isActiveOverSelected: boolean;
	isNavigationSplitButton: boolean;
	isHighlighted: boolean;
};

type NavigationSplitButtonContext = UseSplitButtonContext & {
	appearance: 'subtle';
	spacing: 'default';
	isDisabled: false;
	isActiveOverSelected: false;
	isNavigationSplitButton: true;
	isHighlighted: boolean;
};

type MainSplitButtonContext = UseSplitButtonContext & {
	appearance: SplitButtonAppearance;
	spacing: SplitButtonSpacing;
	isDisabled: boolean;
	isActiveOverSelected: true;
	isNavigationSplitButton: false;
	isHighlighted: false;
};

export const useSplitButtonContext: () =>
	| NavigationSplitButtonContext
	| MainSplitButtonContext
	| undefined = () => {
	const context = useContext(SplitButtonContext);

	if (!context) {
		return undefined;
	}

	if (context.appearance === 'navigation') {
		const newContext: NavigationSplitButtonContext = {
			spacing: 'default',
			appearance: 'subtle',
			isDisabled: false,
			isActiveOverSelected: false,
			isNavigationSplitButton: true,
			isHighlighted: context.isHighlighted,
		};

		return newContext;
	}

	const splitButtonContext: MainSplitButtonContext = {
		spacing: context.spacing,
		appearance: context.appearance,
		isDisabled: context.isDisabled,
		isActiveOverSelected: true,
		isNavigationSplitButton: false,
		isHighlighted: false,
	};

	return splitButtonContext;
};
