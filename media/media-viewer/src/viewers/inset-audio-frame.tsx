import React, { type ReactNode } from 'react';

import AudioIcon from '@atlaskit/icon/core/audio';
import IconTile from '@atlaskit/icon/icon-tile';
import { InsetViewerProvider } from '@atlaskit/media-ui/insetViewerProvider';

import {
	useMediaFooterControls,
	useRegisterMediaFooterPlayerControls,
} from '../insetViewerContext';
import {
	AudioPlayer,
	CustomAudioPlayerWrapper,
	CustomMediaPlayerWrapper,
	DefaultCoverWrapper,
	InsetMediaFrame,
} from '../styleWrappers';

// What the frame passes to the player it renders.
export type InsetAudioPlayerProps = {
	controlsPortalElement: HTMLElement | null;
};

type InsetAudioFrameProps = {
	// The cover to show above the player. Defaults to the audio icon tile.
	cover?: ReactNode;
	renderPlayer: (props: InsetAudioPlayerProps) => ReactNode;
};

// The audio cover in the inset viewer when there is no artwork.
export const InsetAudioDefaultCover = (): React.JSX.Element => (
	<DefaultCoverWrapper>
		<IconTile icon={AudioIcon} label="cover" appearance="gray" size="xlarge" />
	</DefaultCoverWrapper>
);

// The inset viewer's audio layout: the stage frame, the cover and a player with its controls in the
// media footer. Used by the audio viewer and by audio inside a zip file.
export const InsetAudioFrame = ({
	cover,
	renderPlayer,
}: InsetAudioFrameProps): React.JSX.Element => {
	const controlsPortalElement = useMediaFooterControls();
	useRegisterMediaFooterPlayerControls();
	return (
		<CustomMediaPlayerWrapper>
			<InsetMediaFrame isNeutral>
				<AudioPlayer data-testid="media-viewer-audio-content">
					{cover ?? <InsetAudioDefaultCover />}
					<CustomAudioPlayerWrapper>
						<InsetViewerProvider isInsetViewer>
							{renderPlayer({ controlsPortalElement })}
						</InsetViewerProvider>
					</CustomAudioPlayerWrapper>
				</AudioPlayer>
			</InsetMediaFrame>
		</CustomMediaPlayerWrapper>
	);
};
