import React, { createRef, useEffect, memo } from 'react';
import {
	getVideoTextTrackId,
	type VideoTextTrack,
	type VideoTextTracks,
	type VideoTextTracksProps,
} from './text';

const Track = ({
	track,
	kind,
	isShowing,
	textTracksPosition,
}: {
	kind: keyof VideoTextTracks;
	track: VideoTextTrack;
	isShowing: boolean;
	textTracksPosition?: number;
}) => {
	const trackElemref = createRef<HTMLTrackElement>();
	const { lang, label, src } = track;
	useEffect(() => {
		const { track: theTrack } = trackElemref.current || {};
		if (theTrack) {
			theTrack.mode = isShowing ? 'showing' : 'hidden';
		}
	}, [isShowing, trackElemref]);

	useEffect(() => {
		const { track: theTrack } = trackElemref.current || {};
		const { cues } = theTrack || {};
		if (cues && cues.length > 0) {
			[...cues].map((cue) => {
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

const Tracks = ({
	tracks,
	selectedTrackIndex,
	kind,
	textTracksPosition,
}: VideoTextTracksProps & { kind: keyof VideoTextTracks; textTracksPosition?: number }) => {
	return tracks?.map((track, index) => (
		<Track
			key={`track-${index}`}
			kind={kind}
			track={track}
			isShowing={index === selectedTrackIndex}
			textTracksPosition={textTracksPosition}
		/>
	));
};

export const TextTracks = memo(
	({
		videoTextTracks,
		textTracksPosition,
	}: {
		videoTextTracks: VideoTextTracks;
		textTracksPosition?: number;
	}) => {
		return Object.entries(videoTextTracks).map(([kind, { tracks, selectedTrackIndex }], index) => (
			<Tracks
				key={index}
				kind={kind as keyof VideoTextTracks}
				tracks={tracks}
				selectedTrackIndex={selectedTrackIndex}
				textTracksPosition={textTracksPosition}
			/>
		));
	},
);
