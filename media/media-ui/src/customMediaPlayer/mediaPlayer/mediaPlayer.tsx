import React from 'react';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';
import { useFileState, useMediaClient, useMediaSettings } from '@atlaskit/media-client-react';
import { MediaPlayerBase, type MediaPlayerBaseProps } from './mediaPlayerBase';
import { useTextTracks } from './useTextTracks';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export type MediaPlayerProps = Omit<MediaPlayerBaseProps, 'textTracks' | 'mediaSettings'>;

const MediaPlayerBaseWithContext = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'MediaPlayer',
	component: 'MediaPlayer',
})(MediaPlayerBase);

export const MediaPlayer = (props: MediaPlayerProps) => {
	const mediaSettings = useMediaSettings();
	const mediaClient = useMediaClient();
	const { id, collectionName } = props.identifier;
	const { fileState } = useFileState(id, { collectionName });
	const textTracks = useTextTracks(fileState, mediaClient, collectionName);

	return (
		<MediaPlayerBaseWithContext {...props} mediaSettings={mediaSettings} textTracks={textTracks} />
	);
};
