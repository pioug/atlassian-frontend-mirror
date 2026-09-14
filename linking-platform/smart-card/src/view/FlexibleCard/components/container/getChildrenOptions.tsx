/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { MediaPlacement } from '../../../../constants';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { isFlexUiPreviewPresent } from '../../../../state/flexible-ui-context/utils';
import { isFlexibleUiPreviewBlock } from '../../../../utils/is-flexible-ui-preview-block';
import { type ChildrenOptions } from './types';

export const getChildrenOptions = (
	children: React.ReactNode,
	context?: FlexibleUiDataContext,
): ChildrenOptions => {
	let options: ChildrenOptions = {};
	if (isFlexUiPreviewPresent(context)) {
		React.Children.map(children, (child) => {
			if (React.isValidElement(child)) {
				if (isFlexibleUiPreviewBlock(child)) {
					const { placement } = child.props;
					if (placement === MediaPlacement.Left) {
						options.previewOnLeft = true;
					}
					if (placement === MediaPlacement.Right) {
						options.previewOnRight = true;
					}
				}
			}
		});
	}
	return options;
};
