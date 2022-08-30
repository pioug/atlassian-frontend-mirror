import { createContext } from 'react';

import type { TreeAction } from '../../data/tree';

type TreeContextProps = {
  dispatch: (action: TreeAction) => void;
};

export const TreeContext = createContext<TreeContextProps>({
  dispatch: () => {},
});
