import { useContext } from 'react';

import { NestedContext } from './nested-context';

/**
 * __useShouldNestedElementRender__
 *
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
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
