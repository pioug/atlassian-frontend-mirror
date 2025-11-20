import React from 'react';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import { useFileState, useMediaSettings } from '@atlaskit/media-client-react';
import { MediaPlayerBase } from './mediaPlayerBase';
import { useTextTracks } from './useTextTracks';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { type MediaPlayerProps } from './types';

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

export const MediaPlayer = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'MediaPlayer',
	component: 'MediaPlayer',
})(MediaPlayerWihtoutContext);
