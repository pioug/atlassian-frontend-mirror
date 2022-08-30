import { createContext } from 'react';

type TreeItemContextProps = {
  nestingLevel: number;
};

export const TreeItemContext = createContext<TreeItemContextProps>({
  nestingLevel: 0,
});
