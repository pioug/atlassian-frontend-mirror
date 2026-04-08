/* eslint-disable @repo/internal/react/require-jsdoc */
import { createContext, type MutableRefObject } from 'react';

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
export const NestedContext: import('react').Context<NestedContextValue | undefined> = createContext<
	NestedContextValue | undefined
>(undefined);
