import React, { forwardRef } from 'react';

import { default as CompiledMediaSVG } from './media-svg-compiled';
import { type MediaSvgProps } from './types';

export type { MediaSvgProps } from './types';
export type { MediaSVGErrorReason } from './MediaSVGError';

const MediaSVG: React.ForwardRefExoticComponent<
	MediaSvgProps & React.RefAttributes<HTMLImageElement>
> = forwardRef<HTMLImageElement, MediaSvgProps>((props, ref) => (
	<CompiledMediaSVG {...props} ref={ref} />
));

export default MediaSVG;
