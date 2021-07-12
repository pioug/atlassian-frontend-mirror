import React from 'react';
import { createCtx } from '../../util/hooks/ctx';
import type { Props as HelpContentButtonProps } from '../HelpContentButton';

export interface HomeContextInterface {
  homeOptions?: HelpContentButtonProps[];
  homeContent?: React.ReactNode;
}

export const [useHomeContext, CtxProvider] = createCtx<HomeContextInterface>();

export const HomeContextProvider: React.FC<HomeContextInterface> = ({
  homeOptions,
  homeContent,
  children,
}) => {
  return (
    <CtxProvider
      value={{
        homeOptions,
        homeContent,
      }}
    >
      {children}
    </CtxProvider>
  );
};
