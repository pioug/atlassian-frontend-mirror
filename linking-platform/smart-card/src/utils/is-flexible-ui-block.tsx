import React from 'react';

import ActionBlock from '../view/FlexibleCard/components/blocks/action-block';
import AIFooterBlock from '../view/FlexibleCard/components/blocks/ai-footer-block';
import Block from '../view/FlexibleCard/components/blocks/block';
import FooterBlock from '../view/FlexibleCard/components/blocks/footer-block';
import ResolvedHoverCardFooterBlock from '../view/FlexibleCard/components/blocks/hover-card-footer-block';
import MetadataBlock from '../view/FlexibleCard/components/blocks/metadata-block';
import PreviewBlock from '../view/FlexibleCard/components/blocks/preview-block';
import SnippetBlock from '../view/FlexibleCard/components/blocks/snippet-block';
import TitleBlock from '../view/FlexibleCard/components/blocks/title-block';
import { isStyleCacheProvider } from './is-style-cache-provider';

const Blocks = {
	ActionBlock,
	AIFooterBlock,
	Block,
	FooterBlock,
	MetadataBlock,
	PreviewBlock,
	SnippetBlock,
	TitleBlock,
	ResolvedHoverCardFooterBlock,
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
