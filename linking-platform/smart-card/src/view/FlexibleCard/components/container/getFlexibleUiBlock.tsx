/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { isStyleCacheProvider } from '../../../../utils/is-style-cache-provider';
import { default as TitleBlock } from '../blocks/title-block';

/**
 * Note: This function is only necessary for CompiledCSS within Jest tests due to the way it handles Styles.
 * CompiledCSS will inject a StyleCacheProvider around the component tree, which
 * causes the children to be wrapped in a StyleCacheProvider as well. This function recursively
 * searches for the first valid TitleBlock within the children of the StyleCacheProvider.
 */
export const getFlexibleUiBlock = (node: React.ReactNode): React.ReactNode | undefined => {
	if (!React.isValidElement(node)) {
		return undefined;
	}

	if (node.type === TitleBlock) {
		return node;
	}

	if (isStyleCacheProvider(node)) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid: React.ReactNode | undefined;
		React.Children.map(node.props.children, (child) => {
			if (typeof child.type !== 'string' && child.type?.name !== 'Style') {
				isChildrenValid = getFlexibleUiBlock(child);
			}
		});
		return isChildrenValid;
	}
	return undefined;
};
