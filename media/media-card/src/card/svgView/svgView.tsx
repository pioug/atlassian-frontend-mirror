import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { SvgView as SvgViewCompiled } from './svgImage-compiled';
import { SvgView as SvgViewV2 } from './svgViewV2';
import type { SvgViewProps } from './types';

export const SvgView = (props: SvgViewProps): React.JSX.Element => {
	return fg('platform_media_card_image_render') ? (
		<SvgViewV2 {...props} />
	) : (
		<SvgViewCompiled {...props} />
	);
};
