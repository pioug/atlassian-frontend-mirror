/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext } from 'react';

import { type SplitButtonAppearance, type SplitButtonSpacing } from './types';

type NavigationSplitButtonContextProps = {
	appearance: 'navigation';
	isHighlighted: boolean;
};

export type MainSplitButtonContextProps = {
	appearance: SplitButtonAppearance;
	spacing: SplitButtonSpacing;
	isDisabled: boolean;
};

type SplitButtonContextProps = NavigationSplitButtonContextProps | MainSplitButtonContextProps;

export const SplitButtonContext: import('react').Context<SplitButtonContextProps | undefined> =
	createContext<SplitButtonContextProps | undefined>(undefined);
