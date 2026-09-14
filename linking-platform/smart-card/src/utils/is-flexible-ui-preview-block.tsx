import React from 'react';

import { default as PreviewBlock } from '../view/FlexibleCard/components/blocks/preview-block';

import { isStyleCacheProvider } from './is-style-cache-provider';

export const isFlexibleUiPreviewBlock = (node: React.ReactNode): boolean => {
	if (!React.isValidElement(node)) {
		return false;
	}

	if (node.type === PreviewBlock) {
		return true;
	}

	if (isStyleCacheProvider(node)) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid = true;
		React.Children.map(node.props.children, (child) => {
			if (!React.isValidElement(child)) {
				isChildrenValid = false;
				return;
			}

			if (typeof child.type !== 'string' && child.type?.name !== 'Style') {
				isChildrenValid = isFlexibleUiPreviewBlock(child);
			}
		});
		return isChildrenValid;
	}
	return false;
};
