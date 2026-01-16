import React from 'react';

import * as Blocks from '../view/FlexibleCard/components/blocks';
import { FooterBlock, PreviewBlock, TitleBlock } from '../view/FlexibleCard/components/blocks';
import * as Elements from '../view/FlexibleCard/components/elements';
import { type FlexibleUiOptions } from '../view/FlexibleCard/types';

export const isFlexibleUiCard = (children?: React.ReactNode, ui?: FlexibleUiOptions): boolean => {
	if (ui?.removeBlockRestriction) {
		return children && React.Children.toArray(children)?.length > 0 ? true : false;
	}

	if (children && React.Children.toArray(children).some((child) => isFlexibleUiTitleBlock(child))) {
		return true;
	}
	return false;
};

export const isStyleCacheProvider = (
	node: React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
): boolean => {
	if (
		typeof node.type !== 'string' &&
		node.type?.name === 'StyleCacheProvider' &&
		node.props.children
	) {
		return true;
	} else if (typeof node.type !== 'string' && node.type?.name === 'CC' && node.props.children) {
		return true;
	}
	return false;
};

export const isFlexibleUiBlock = (node: React.ReactNode): boolean => {
	if (!React.isValidElement(node)) {
		return false;
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
				isChildrenValid = isFlexibleUiBlock(child);
			}
		});
		return isChildrenValid;
	}
	if (Object.values(Blocks).some((type) => type === node.type)) {
		return true;
	}
	return false;
};

export const isFlexibleUiElement = (node: React.ReactNode): boolean => {
	if (!React.isValidElement(node)) {
		return false;
	}

	if (Object.values(Elements).some((type) => type === node.type)) {
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
				isChildrenValid = isFlexibleUiElement(child);
			}
		});
		return isChildrenValid;
	}
	return false;
};

export const isFlexibleUiTitleBlock = (node: React.ReactNode): boolean => {
	if (!React.isValidElement(node)) {
		return false;
	}

	if (node.type === TitleBlock) {
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
				isChildrenValid = isFlexibleUiTitleBlock(child);
			}
		});
		return isChildrenValid;
	}
	return false;
};

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

export const isFlexibleUiFooterBlock = (node: React.ReactNode): boolean =>
	React.isValidElement(node) && node.type === FooterBlock;
