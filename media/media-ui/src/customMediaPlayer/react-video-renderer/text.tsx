import { type MediaUserArtifactCaptionKey } from '@atlaskit/media-state';

export type VideoTextTracks = {
	subtitles?: VideoTextTracksProps;
	captions?: VideoTextTracksProps;
	descriptions?: VideoTextTracksProps;
	chapters?: VideoTextTracksProps;
	metadata?: VideoTextTracksProps;
};

export type VideoTextTracksProps = {
	selectedTrackIndex?: number;
	tracks: VideoTextTrack[];
};

export type VideoTextTrack = {
	src?: string;
	lang: string;
	label: string;
	artifactName: MediaUserArtifactCaptionKey;
};

export type VideoTextTrackKind = keyof VideoTextTracks;

export const getVideoTextTrackId = (kind: VideoTextTrackKind, lang: string) => `${kind}-${lang}`;
