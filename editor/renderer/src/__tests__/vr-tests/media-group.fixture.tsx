import React from 'react';

import { mediaGroupAdf } from '../__fixtures__/renderer-mediaGroup.adf';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

export const MediaGroup = () => {
	return <MediaBaseRenderer adf={mediaGroupAdf} />;
};

export const MediaGroupWithReactLooselyLazy = () => {
	return <MediaBaseRenderer adf={mediaGroupAdf} nodeComponents={looselyLazyNodes} />;
};
