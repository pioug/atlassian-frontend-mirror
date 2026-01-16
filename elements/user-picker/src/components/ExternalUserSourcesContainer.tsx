import React, { type ReactNode } from 'react';
import { useUserSource } from '../clients/UserSourceProvider';
import { type UserSource } from '../types';

export interface ExternalUserSourcesData {
	sources: UserSource[];
	sourcesLoading: boolean;
}

type SourcesChildrenFunc = (sourcesData: ExternalUserSourcesData) => ReactNode;

interface SourcesContainerProps {
	accountId: string;
	children: SourcesChildrenFunc;
	initialSources: UserSource[];
	shouldFetchSources: boolean;
}

export const ExternalUserSourcesContainer = ({
	children,
	accountId,
	shouldFetchSources,
	initialSources,
}: SourcesContainerProps): any => {
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
