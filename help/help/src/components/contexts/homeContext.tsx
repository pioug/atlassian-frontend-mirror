import React, { PropsWithChildren } from 'react';
import { createCtx } from '../../util/hooks/ctx';
import type { Props as HelpContentButtonProps } from '../HelpContentButton';

export interface HomeContextInterface {
  homeOptions?: HelpContentButtonProps[];
  homeContent?: React.ReactNode;
}

export const [useHomeContext, CtxProvider] = createCtx<HomeContextInterface>();

export const HomeContextProvider = ({
  homeOptions,
  homeContent,
  children,
}: PropsWithChildren<HomeContextInterface>) => {
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
