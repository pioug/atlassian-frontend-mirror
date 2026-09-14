/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import React, { forwardRef } from 'react';

import { default as CompiledMediaSVG } from './media-svg-compiled';
import { type MediaSvgProps } from './types';

export type { MediaSvgProps } from './types';
/**
 * @deprecated Use `import { MediaSVGError } from '@atlaskit/media-svg/media-svg-error'` instead.
 */
export { MediaSVGError } from './MediaSVGError';
export type { MediaSVGErrorReason } from './MediaSVGError';

const MediaSVG: React.ForwardRefExoticComponent<
	MediaSvgProps & React.RefAttributes<HTMLImageElement>
> = forwardRef<HTMLImageElement, MediaSvgProps>((props, ref) => (
	<CompiledMediaSVG {...props} ref={ref} />
));

export default MediaSVG;

/**
 * @deprecated Use `import { useResolveSvg } from '@atlaskit/media-svg/use-resolve-svg'` instead.
 */
export { useResolveSvg } from './useResolveSvg';
