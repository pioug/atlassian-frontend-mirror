import React from 'react';

import { mediaGroupAdf } from '../__fixtures__/renderer-mediaGroup.adf';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

export const MediaGroup = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={mediaGroupAdf} />;
};

export const MediaGroupWithReactLooselyLazy = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={mediaGroupAdf} nodeComponents={looselyLazyNodes} />;
};
