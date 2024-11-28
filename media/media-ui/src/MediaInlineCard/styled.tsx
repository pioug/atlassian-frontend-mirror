import React from 'react';
import { NoLinkAppearance as EmotionNoLinkAppearance } from './styled-emotion';
import { NoLinkAppearance as CompiledNoLinkAppearance } from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const NoLinkAppearance = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledNoLinkAppearance {...props} />
	) : (
		<EmotionNoLinkAppearance {...props} />
	);
