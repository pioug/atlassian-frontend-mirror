import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { SvgView as SvgViewCompiled } from './svgImage-compiled';
import { SvgView as SvgViewEmotion } from './svgImage-emotion';
import type { SvgViewProps } from './types';

export const SvgView = (props: SvgViewProps) => {
	return fg('platform_media_compiled') ? (
		<SvgViewCompiled {...props} />
	) : (
		<SvgViewEmotion {...props} />
	);
};
