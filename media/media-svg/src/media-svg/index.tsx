import React, { forwardRef } from 'react';

import { default as CompiledMediaSVG } from './media-svg-compiled';
import { type MediaSvgProps } from './types';

export type { MediaSvgProps } from './types';
export { MediaSVGError } from './errors';
export type { MediaSVGErrorReason } from './errors';

const MediaSVG = forwardRef<HTMLImageElement, MediaSvgProps>((props, ref) => (
	<CompiledMediaSVG {...props} ref={ref} />
));

export default MediaSVG;

export { useResolveSvg } from './useResolveSvg';
