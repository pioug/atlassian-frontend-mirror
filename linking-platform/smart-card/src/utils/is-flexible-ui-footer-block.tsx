import React from 'react';

import { default as FooterBlock } from '../view/FlexibleCard/components/blocks/footer-block';

export const isFlexibleUiFooterBlock = (node: React.ReactNode): boolean =>
	React.isValidElement(node) && node.type === FooterBlock;
