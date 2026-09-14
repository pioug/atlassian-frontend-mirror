import React from 'react';

import { type FlexibleUiOptions } from '../view/FlexibleCard/types';
import { isFlexibleUiTitleBlock } from './is-flexible-ui-title-block';

export const isFlexibleUiCard = (children?: React.ReactNode, ui?: FlexibleUiOptions): boolean => {
	if (ui?.removeBlockRestriction) {
		return children && React.Children.toArray(children)?.length > 0 ? true : false;
	}

	if (children && React.Children.toArray(children).some((child) => isFlexibleUiTitleBlock(child))) {
		return true;
	}
	return false;
};
