import React from 'react';

import { type SmartLinkSize } from '../../../../constants';
import { isFlexibleUiElement } from '../../../../utils/is-flexible-ui-element';

import ActionGroup from './action-group';
import ElementGroup from './element-group';

const isActionGroup = (node: React.ReactNode) =>
	React.isValidElement(node) && node.type === ActionGroup;

const isElementOrElementGroup = (node: React.ReactNode) =>
	React.isValidElement(node) && (isFlexibleUiElement(node) || node.type === ElementGroup);

export const renderChildren = (children: React.ReactNode, size: SmartLinkSize): React.ReactNode =>
	React.Children.map(children, (child) => {
		if (isElementOrElementGroup(child) || isActionGroup(child)) {
			const node = child as React.ReactElement;
			const { size: childSize } = node.props;
			return React.cloneElement(node, { size: childSize || size });
		}
		return child;
	});
