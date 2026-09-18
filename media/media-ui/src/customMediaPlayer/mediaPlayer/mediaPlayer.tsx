import React from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { useFileState } from '@atlaskit/media-client-react/use-file-state';
import { useMediaSettings } from '@atlaskit/media-client-react/use-media-settings';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';

import { MediaPlayerBase } from './mediaPlayerBase';
import { type MediaPlayerProps } from './types';
import { useTextTracks } from './useTextTracks';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export const MediaPlayerWihtoutContext = ({
	onPlay,
	...props
}: MediaPlayerProps): React.JSX.Element => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const mediaSettings = useMediaSettings();
	const { id, collectionName } = props.identifier;
	const { fileState } = useFileState(id, { collectionName });
	const {
		textTracks,
		verifyUserCaptionsEnabled,
		setSelectedTracksIndex,
		setAreCaptionsEnabled,
		areCaptionsEnabled,
	} = useTextTracks({ fileState, collectionName, type: props.type });

	return (
		<MediaPlayerBase
			{...props}
			fileState={fileState}
			mediaSettings={mediaSettings}
			textTracks={textTracks}
			createAnalyticsEvent={createAnalyticsEvent}
			areCaptionsEnabled={areCaptionsEnabled}
			onPlay={() => {
				verifyUserCaptionsEnabled();
				onPlay?.();
			}}
			onTextTracksSelected={setSelectedTracksIndex}
			onCaptionsEnabledChange={setAreCaptionsEnabled}
		/>
	);
};

export const MediaPlayer: React.ForwardRefExoticComponent<
	MediaPlayerProps & React.RefAttributes<any>
> = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'MediaPlayer',
	component: 'MediaPlayer',
})(MediaPlayerWihtoutContext);
