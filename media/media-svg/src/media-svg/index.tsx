import React, { forwardRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { default as EmotionMediaSVG } from './media-svg';
import { default as CompiledMediaSVG } from './media-svg-compiled';
import { type MediaSvgProps } from './types';

export type { MediaSvgProps } from './types';
export { MediaSVGError } from './errors';
export type { MediaSVGErrorReason } from './errors';

const MediaSVG: typeof EmotionMediaSVG = forwardRef<HTMLImageElement, MediaSvgProps>(
	(props, ref) =>
		fg('platform_media_compiled') ? (
			<CompiledMediaSVG {...props} ref={ref} />
		) : (
			<EmotionMediaSVG {...props} ref={ref} />
		),
);

export default MediaSVG;
