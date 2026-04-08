import { useContext } from 'react';

import { NestedContext, type NestedContextValue } from './nested-context';

export const useNestedContext: () => NestedContextValue = (): NestedContextValue => {
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
