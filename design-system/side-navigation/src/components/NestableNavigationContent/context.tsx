import { createContext, type MutableRefObject, useContext } from 'react';

/**
 * @internal
 */
export interface NestedContextValue {
	currentStackId: string;
	onNest: (id: string) => void;
	onUnNest: () => void;
	stack: string[];
	parentId: string;
	backButton?: React.ReactNode;
	childIds: MutableRefObject<Set<string>>;
	forceShowTopScrollIndicator: boolean | undefined;
	activeParentId?: string;
	goBackButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
	isDefaultFocusControl?: boolean;
	focusGoBackButton?: boolean;
}

/**
 * @internal
 */
export const NestedContext: import('react').Context<NestedContextValue | undefined> = createContext<
	NestedContextValue | undefined
>(undefined);

export const useNestedContext: () => NestedContextValue = (): NestedContextValue => {
	const context = useContext(NestedContext);
	if (!context) {
		let error = '';
		if (process.env.NODE_ENV === 'development') {
			error = `
To use a <NestingItem /> it needs to be a descendant of <NestableNavigationContent>.
You probably need to replace your <NavigationContent> with <NestableNavigationContent>.

import { NestableNavigationContent } from '@atlaskit/side-navigation';
      `;
		}

		throw new Error(error);
	}

	return context;
};

/**
 * Used by children of the NestableNavigationContent component to see if they should render or not.
 * If `shouldRender` returns `true` - return your nodes.
 * If it returns `false` - either return `null` or `children` if you have children.
 */
export const useShouldNestedElementRender: () => {
	shouldRender: boolean;
} = () => {
	const context = useContext(NestedContext);

	if (!context) {
		return {
			shouldRender: true,
		};
	}

	return {
		shouldRender: context.currentStackId === context.parentId,
	};
};
