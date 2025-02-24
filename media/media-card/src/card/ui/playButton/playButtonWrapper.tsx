import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { PlayButtonWrapper as CompiledPlayButtonWrapper } from './playButtonWrapper-compiled';
import { PlayButtonWrapper as EmotionPlayButtonWrapper } from './playButtonWrapper-emotion';

export const PlayButtonWrapper = (props: any) =>
	fg('platform_media_compiled') ? (
		<CompiledPlayButtonWrapper {...props} />
	) : (
		<EmotionPlayButtonWrapper {...props} />
	);
