import React, { ReactNode } from 'react';
import { useUserSource } from '../clients/UserSourceProvider';
import { UserSource } from '../types';

export interface ExternalUserSourcesData {
  sources: UserSource[];
  sourcesLoading: boolean;
  sourcesError: string | null;
}

type SourcesChildrenFunc = (sourcesData: ExternalUserSourcesData) => ReactNode;

interface SourcesContainerProps {
  accountId: string;
  shouldFetchSources: boolean;
  initialSources: UserSource[];
  children: SourcesChildrenFunc;
}

export const ExternalUserSourcesContainer: React.FC<SourcesContainerProps> = ({
  children,
  accountId,
  shouldFetchSources,
  initialSources,
}) => {
  const {
    sources,
    loading: sourcesLoading,
    error: sourcesError,
  } = useUserSource(accountId, shouldFetchSources, initialSources);

  if (typeof children === 'function') {
    return (children as Function)({ sources, sourcesLoading, sourcesError });
  }

  return React.Children.map(children, (child) =>
    React.cloneElement(child as JSX.Element, {
      sources,
      sourcesLoading,
      sourcesError,
    }),
  );
};
