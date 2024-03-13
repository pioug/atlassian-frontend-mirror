import React, { ReactNode } from 'react';
import { useUserSource } from '../clients/UserSourceProvider';
import { UserSource } from '../types';

export interface ExternalUserSourcesData {
  sources: UserSource[];
  sourcesLoading: boolean;
}

type SourcesChildrenFunc = (sourcesData: ExternalUserSourcesData) => ReactNode;

interface SourcesContainerProps {
  accountId: string;
  shouldFetchSources: boolean;
  initialSources: UserSource[];
  children: SourcesChildrenFunc;
}

export const ExternalUserSourcesContainer = ({
  children,
  accountId,
  shouldFetchSources,
  initialSources,
}: SourcesContainerProps) => {
  const { sources, loading: sourcesLoading } = useUserSource(
    accountId,
    shouldFetchSources,
    initialSources,
  );

  if (typeof children === 'function') {
    return (children as Function)({ sources, sourcesLoading });
  }

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      sources,
      sourcesLoading,
    }),
  );
};
