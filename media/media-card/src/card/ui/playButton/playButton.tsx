import React from 'react';

import VidPlayIcon from '@atlaskit/icon/core/video-play-overlay';

import { PlayButtonBackground } from './playButtonBackground';
import { PlayButtonWrapper } from './playButtonWrapper';

export const PlayButton = (): React.JSX.Element => {
	return (
		<PlayButtonWrapper>
			<PlayButtonBackground />
			<VidPlayIcon color="currentColor" label="play" />
		</PlayButtonWrapper>
	);
};
