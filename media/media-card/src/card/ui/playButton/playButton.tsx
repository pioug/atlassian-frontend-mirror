import React from 'react';
import LegacyVidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPlayIcon from '@atlaskit/icon/core/video-play-overlay';
import { PlayButtonWrapper } from './playButtonWrapper';
import { PlayButtonBackground } from './playButtonBackground';

export const PlayButton = (): React.JSX.Element => {
	return (
		<PlayButtonWrapper>
			<PlayButtonBackground />
			<VidPlayIcon
				color="currentColor"
				label="play"
				LEGACY_size="large"
				LEGACY_fallbackIcon={LegacyVidPlayIcon}
			/>
		</PlayButtonWrapper>
	);
};
