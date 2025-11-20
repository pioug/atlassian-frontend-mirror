import React from 'react';
import { ImageRenderer as ImageRendererV1 } from './imageRenderer';
import { ImageRenderer as ImageRendererV2 } from './imageRendererV2';
import { fg } from '@atlaskit/platform-feature-flags';
import type { ImageRendererProps } from './types';

export const ImageRenderer = (props: ImageRendererProps): React.JSX.Element => {
	return fg('platform_media_card_image_render') ? (
		<ImageRendererV2 {...props} />
	) : (
		<ImageRendererV1 {...props} />
	);
};
