import { createContext } from 'react';

// Note: this context value is in a seperate file as it is consumed
// by our drag and drop drag preview

/**
 * A context for storing the level value of the ExpandableMenuItem.
 */
export const ExpandableMenuItemLevelContext = createContext(0);
