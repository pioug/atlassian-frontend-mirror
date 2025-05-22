import {
	type FileState,
	type MediaUserArtifact,
	type MediaFileArtifacts,
} from '@atlaskit/media-state';
import { type MediaClient, hasArtifacts } from '@atlaskit/media-client';
import { useState, useEffect } from 'react';
import { type VideoTextTrack, type VideoTextTracks } from '../react-video-renderer';

type CaptionsRawMetadata = { l?: string; f?: string; label?: string };
type CaptionsMetadata = { lang: string; fileName: string; label: string };

const decodeMimetype = (mimeType?: string): CaptionsMetadata => {
	const keyValues = mimeType?.split(';') || [];
	const captionsRawMetadata: CaptionsRawMetadata = Object.fromEntries(
		keyValues.map((keyValue) => keyValue.split('=')),
	);

	return {
		lang: captionsRawMetadata.l || 'en',
		fileName: captionsRawMetadata.f || 'no-name.vtt',
		label: captionsRawMetadata.label || 'no-name',
	};
};

export const useTextTracks = (
	fileState?: FileState,
	mediaClient?: MediaClient,
	collectionName?: string,
): VideoTextTracks | undefined => {
	const [textTracks, setTextTracks] = useState<VideoTextTracks | undefined>();

	useEffect(() => {
		if (!fileState || !hasArtifacts(fileState)) {
			return;
		}
		const captions = Object.entries(fileState.artifacts || {}).filter(
			(caption): caption is [keyof MediaFileArtifacts, MediaUserArtifact] => {
				const [key, value] = caption;
				return key.includes('ugc_caption') && !!value;
			},
		);

		if (captions.length > 0) {
			Promise.all(
				captions.map(async ([artifactName, { mimeType }]): Promise<VideoTextTrack> => {
					const { artifacts } = fileState;
					const baseUrl =
						artifacts &&
						(await mediaClient?.mediaStore.getArtifactBinary(artifacts, artifactName, {
							collectionName,
						}));

					const src = (baseUrl && URL.createObjectURL(baseUrl)) || '';
					const { lang, label } = decodeMimetype(mimeType);
					return { src, lang, label };
				}),
			).then((tracks) => {
				setTextTracks({
					captions: {
						selectedTrackIndex: 1,
						tracks: tracks.filter((track): track is VideoTextTrack => !!track.src),
					},
				});
			});
		}
	}, [fileState, collectionName, mediaClient]);

	return textTracks;
};
