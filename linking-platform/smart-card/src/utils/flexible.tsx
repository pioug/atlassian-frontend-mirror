import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import * as Blocks from '../view/FlexibleCard/components/blocks';
import { FooterBlock, PreviewBlock, TitleBlock } from '../view/FlexibleCard/components/blocks';
import * as Elements from '../view/FlexibleCard/components/elements';

export const isFlexibleUiCard = (children?: React.ReactNode): boolean => {
	if (children && React.Children.toArray(children).some((child) => isFlexibleUiTitleBlock(child))) {
		return true;
	}
	return false;
};

export const isFlexibleUiBlock = (node: React.ReactNode): boolean => {
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return React.isValidElement(node) && Object.values(Blocks).some((type) => type === node.type);
	}

	if (!React.isValidElement(node)) {
		return false;
	}

	if (typeof node.type !== 'string' && node.type?.name === 'StyleCacheProvider') {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid = true;
		React.Children.map(node.props.children, (child) => {
			if (!isChildrenValid) {
				return;
			}

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
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return React.isValidElement(node) && Object.values(Elements).some((type) => type === node.type);
	}

	if (!React.isValidElement(node)) {
		return false;
	}

	if (Object.values(Elements).some((type) => type === node.type)) {
		return true;
	}

	if (
		typeof node.type !== 'string' &&
		node.type?.name === 'StyleCacheProvider' &&
		node.props.children
	) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid = true;
		React.Children.map(node.props.children, (child) => {
			if (!isChildrenValid) {
				return;
			}

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
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return React.isValidElement(node) && node.type === TitleBlock;
	}

	if (!React.isValidElement(node)) {
		return false;
	}

	if (node.type === TitleBlock) {
		return true;
	}

	if (
		typeof node.type !== 'string' &&
		node.type?.name === 'StyleCacheProvider' &&
		node.props.children
	) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid = true;
		React.Children.map(node.props.children, (child) => {
			if (!isChildrenValid) {
				return;
			}

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
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return React.isValidElement(node) && node.type === PreviewBlock;
	}

	if (!React.isValidElement(node)) {
		return false;
	}

	if (node.type === PreviewBlock) {
		return true;
	}

	if (
		typeof node.type !== 'string' &&
		node.type?.name === 'StyleCacheProvider' &&
		node.props.children
	) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid = true;
		React.Children.map(node.props.children, (child) => {
			if (!isChildrenValid) {
				return;
			}

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
