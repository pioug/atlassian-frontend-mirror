import React from 'react';
import VidPlayIcon from '@atlaskit/icon/core/video-play-overlay';
import { PlayButtonWrapper } from './playButtonWrapper';
import { PlayButtonBackground } from './playButtonBackground';

export const PlayButton = (): React.JSX.Element => {
	return (
		<PlayButtonWrapper>
			<PlayButtonBackground />
			<VidPlayIcon color="currentColor" label="play" />
		</PlayButtonWrapper>
	);
};
