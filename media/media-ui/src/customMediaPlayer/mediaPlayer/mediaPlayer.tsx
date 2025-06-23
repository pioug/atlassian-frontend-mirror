import React from 'react';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import { useFileState, useMediaClient, useMediaSettings } from '@atlaskit/media-client-react';
import { MediaPlayerBase, type MediaPlayerBaseProps } from './mediaPlayerBase';
import { useTextTracks } from './useTextTracks';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type MediaPlayerProps = Omit<MediaPlayerBaseProps, 'textTracks' | 'mediaSettings'>;

export const MediaPlayerWihtoutContext = (props: MediaPlayerProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const mediaSettings = useMediaSettings();
	const mediaClient = useMediaClient();
	const { id, collectionName } = props.identifier;
	const { fileState } = useFileState(id, { collectionName });
	const textTracks = useTextTracks(fileState, mediaClient, collectionName);

	return (
		<MediaPlayerBase
			{...props}
			fileState={fileState}
			mediaSettings={mediaSettings}
			textTracks={textTracks}
			createAnalyticsEvent={createAnalyticsEvent}
		/>
	);
};

export const MediaPlayer = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'MediaPlayer',
	component: 'MediaPlayer',
})(MediaPlayerWihtoutContext);
