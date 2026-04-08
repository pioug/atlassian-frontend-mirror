import { useContext } from 'react';

import { NestedContext } from './nested-context';

export const useShouldNestedElementRender: () => {
	shouldRender: boolean;
} = () => {
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
