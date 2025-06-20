import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

import { ExpandableMenuItemLevelContext } from './expandable-menu-item-level-context';

type onExpansionToggle = (isExpanded: boolean) => void;

/**
 * Whether all ancestor menu items of the current menu item are expanded. Used to know if the current menu item is
 * shown within the menu item tree.
 */
export const AreAllAncestorsExpandedContext = createContext<boolean | null>(null);

/**
 * A context for storing the isExpanded value of the ExpandableMenuItem.
 */
export const IsExpandedContext = createContext<boolean | null>(null);

/**
 * A context for storing a function that sets isExpanded value of the ExpandableMenuItem.
 */
export const SetIsExpandedContext = createContext<((value: boolean) => void) | null>(null);

/**
 * A context for storing a function that triggers when isExpanded value of the ExpandableMenuItem is changed.
 */
export const OnExpansionToggleContext = createContext<onExpansionToggle | null>(null);

/**
 * A context for storing the level value of the ExpandableMenuItem.
 */
export const LevelContext = ExpandableMenuItemLevelContext;

export const useIsExpanded = (): boolean => {
	const context = useContext(IsExpandedContext);
	invariant(context !== null, 'useIsExpanded must be used within an ExpandableMenuItem');
	return context;
};

export const useSetIsExpanded = (): ((value: boolean) => void) => {
	const context = useContext(SetIsExpandedContext);
	invariant(context !== null, 'useSetIsExpanded must be used within an ExpandableMenuItem');
	return context;
};

export const useOnExpansionToggle = (): onExpansionToggle | null =>
	useContext(OnExpansionToggleContext);

export const useLevel = (): number => useContext(LevelContext);

/**
 * Whether all ancestor menu items of the current menu item are expanded. Used to know if the current menu item is
 * shown within the menu item tree.
 *
 * It works by combining (using &&) all the expansion states of the current menu item's ancestors.
 *
 * Using `true` as the fallback for cases when the menu item does not have ancestors.
 */
export const useAreAllAncestorsExpanded = (): boolean =>
	useContext(AreAllAncestorsExpandedContext) ?? true;
