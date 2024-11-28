import React from 'react';
import { PlayPauseBlanket as EmotionPlayPauseBlanket } from './playPauseBlanket-emotion';
import { PlayPauseBlanket as CompiledPlayPauseBlanket } from './playPauseBlanket-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const PlayPauseBlanket = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledPlayPauseBlanket {...props} />
	) : (
		<EmotionPlayPauseBlanket {...props} />
	);
