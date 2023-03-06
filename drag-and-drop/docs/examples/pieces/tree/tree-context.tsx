import { createContext } from 'react';

import {
  attachInstruction,
  extractInstruction,
} from '@atlaskit/drag-and-drop-hitbox/experimental/tree-item';
import { DropIndicator } from '@atlaskit/drag-and-drop-indicator/experimental/tree-item';

import type { TreeAction } from '../../data/tree';

export type TreeContextValue = {
  dispatch: (action: TreeAction) => void;
  uniqueContextId: Symbol;
  getPathToItem: (itemId: string) => string[];
};

export const TreeContext = createContext<TreeContextValue>({
  dispatch: () => {},
  uniqueContextId: Symbol('uniqueId'),
  getPathToItem: () => [],
});

export type DependencyContext = {
  DropIndicator: typeof DropIndicator;
  attachInstruction: typeof attachInstruction;
  extractInstruction: typeof extractInstruction;
};

export const DependencyContext = createContext<DependencyContext>({
  DropIndicator: DropIndicator,
  attachInstruction: attachInstruction,
  extractInstruction: extractInstruction,
});
