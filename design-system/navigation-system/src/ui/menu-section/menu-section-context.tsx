import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

/**
 * Context for the current menu section. It holds a unique ID for the section, used for associating the section heading
 * as an accessible label for the group.
 */
export const MenuSectionContext = createContext<string | null>(null);

export const useMenuSectionContext = () => {
	const context = useContext(MenuSectionContext);
	invariant(context, 'useMenuSectionContext must be used within a MenuSection');
	return context;
};
