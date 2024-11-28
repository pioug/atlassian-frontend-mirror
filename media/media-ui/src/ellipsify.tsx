import React from 'react';
import { Ellipsify as EmotionEllipsify } from './ellipsify-emotion';
import { Ellipsify as CompiledEllipsify } from './ellipsify-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const Ellipsify: typeof EmotionEllipsify = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledEllipsify {...props} />
	) : (
		<EmotionEllipsify {...props} />
	);

export type { EllipsifyProps } from './ellipsify-compiled';
export type { WrapperProps } from './ellipsify-emotion';

export default Ellipsify;
