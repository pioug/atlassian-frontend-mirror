import React from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import { PlayButtonWrapper } from './playButtonWrapper';
import { PlayButtonBackground } from './playButtonBackground';

export const PlayButton = () => {
	return (
		<PlayButtonWrapper>
			<PlayButtonBackground />
			<VidPlayIcon label="play" size="large" />
		</PlayButtonWrapper>
	);
};
