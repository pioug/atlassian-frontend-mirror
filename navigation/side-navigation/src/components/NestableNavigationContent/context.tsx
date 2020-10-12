import { createContext, useContext } from 'react';

interface NestedContext {
  currentStackId: string;
  onNest: (id: string) => void;
  onUnNest: () => void;
  stack: string[];
  parentId: string;
  backButton?: React.ReactNode;
}

export const NestedContext = createContext<NestedContext | undefined>(
  undefined,
);

export const useNestedContext = (): NestedContext => {
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
export const useShouldNestedElementRender = () => {
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
