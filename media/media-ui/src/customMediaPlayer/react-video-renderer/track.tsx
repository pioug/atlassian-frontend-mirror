import React, { createRef, useEffect, memo, useCallback } from 'react';
import {
	getVideoTextTrackId,
	type VideoTextTrack,
	type VideoTextTracks,
	type VideoTextTracksProps,
} from './text';

type TrackProps = {
	kind: keyof VideoTextTracks;
	textTrack: VideoTextTrack;
	isShowing: boolean;
	textTracksPosition?: number;
	onLoad?: () => void;
	onError?: (artifactName: string, lang: string, label: string) => void;
};

const Track = ({ textTrack, kind, isShowing, textTracksPosition, onLoad, onError }: TrackProps) => {
	const trackElemref = createRef<HTMLTrackElement>();
	const { lang, label, src, artifactName } = textTrack;
	useEffect(() => {
		const { track } = trackElemref.current || {};
		if (track) {
			track.mode = isShowing ? 'showing' : 'hidden';
		}
	}, [isShowing, trackElemref]);

	const onErrorInternal = useCallback(() => {
		// Only report the error when the src has been set
		if (src) {
			onError?.(artifactName, lang, label);
		}
	}, [artifactName, lang, label, onError, src]);

	useEffect(() => {
		const trackElement = trackElemref.current;
		if (trackElement) {
			trackElement.onload = () => {
				onLoad?.();
			};
			trackElement.onerror = onErrorInternal;
		}
	}, [trackElemref, onLoad, onErrorInternal]);

	useEffect(() => {
		const { track: theTrack } = trackElemref.current || {};
		const { cues } = theTrack || {};
		if (cues && cues.length > 0) {
			[...cues].forEach((cue) => {
				// Positioning Text Tracks
				(cue as VTTCue).line = textTracksPosition || 'auto';
				(cue as VTTCue).size = 95;
			});
		}
	}, [textTracksPosition, trackElemref]);

	return (
		<track
			ref={trackElemref}
			id={getVideoTextTrackId(kind, lang)}
			kind={kind}
			src={src}
			srcLang={lang}
			label={label}
		/>
	);
};

type TracksProps = VideoTextTracksProps & {
	kind: keyof VideoTextTracks;
	textTracksPosition?: number;
	onLoad?: () => void;
	onError?: (artifactName: string, lang: string, label: string) => void;
};

const Tracks = ({
	tracks,
	selectedTrackIndex,
	kind,
	textTracksPosition,
	onLoad,
	onError,
}: TracksProps) => {
	return tracks?.map((track, index) => (
		<Track
			key={`track-${index}`}
			kind={kind}
			textTrack={track}
			isShowing={index === selectedTrackIndex}
			textTracksPosition={textTracksPosition}
			onLoad={onLoad}
			onError={onError}
		/>
	));
};

type TextTracksProps = {
	videoTextTracks: VideoTextTracks;
	textTracksPosition?: number;
	onLoad?: () => void;
	onError?: (artifactName: string, lang: string, label: string) => void;
};

export const TextTracks = memo(
	({
		videoTextTracks,
		textTracksPosition,
		onLoad,
		onError,
	}: TextTracksProps): React.JSX.Element[] => {
		return Object.entries(videoTextTracks).map(([kind, { tracks, selectedTrackIndex }], index) => (
			<Tracks
				key={index}
				kind={kind as keyof VideoTextTracks}
				tracks={tracks}
				selectedTrackIndex={selectedTrackIndex}
				textTracksPosition={textTracksPosition}
				onLoad={onLoad}
				onError={onError}
			/>
		));
	},
);
