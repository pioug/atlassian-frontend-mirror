import {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
	type Dispatch,
	type SetStateAction,
} from 'react';

import { useIntl } from 'react-intl';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { hasArtifacts } from '@atlaskit/media-client';
import { useMediaClient } from '@atlaskit/media-client-react/use-media-client';
import { useMediaSettings } from '@atlaskit/media-client-react/use-media-settings';
import { type MediaTraceContext, getRandomTelemetryId } from '@atlaskit/media-common';
import type {
	FileState,
	MediaUserArtifact,
	MediaUserArtifactCaptionKey,
} from '@atlaskit/media-state/file-state';

import { createCaptionDisplayFailedEventPayload } from '../analytics/events/operational/createCaptionDisplayFailedEventPayload';
import { fireAnalyticsEvent } from '../analytics/utils/fireAnalyticsEvent';
import type { VideoTextTrack, VideoTextTracks } from '../react-video-renderer/text';
import { type CustomMediaPlayerType } from '../types';
import { getUserCaptionsEnabled } from './captions/getUserCaptionsEnabled';
import { getUserCaptionsLocale } from './captions/getUserCaptionsLocale';
import { findPreselectedTrackIndex } from './captions/selectTracks';
import { setUserCaptionsEnabled } from './captions/setUserCaptionsEnabled';
import { setUserCaptionsLocale } from './captions/setUserCaptionsLocale';

type CaptionsRawMetadata = { l?: string; n?: string };
type CaptionsMetadata = { lang: string; fileName: string; label: string };

const decodeMimetype = (mimeType?: string): CaptionsMetadata => {
	const keyValues = mimeType?.split(';') || [];
	const captionsRawMetadata: CaptionsRawMetadata = Object.fromEntries(
		keyValues.map((keyValue) => keyValue.split('=')),
	);

	const fileName = captionsRawMetadata.n ? atob(captionsRawMetadata.n) : 'no-name';
	const lang = captionsRawMetadata.l || 'en';

	return {
		lang,
		fileName,
		label: lang,
	};
};

const NO_SELECTED_TRACKS_INDEX = -1;

type UseTextTracksProps = {
	fileState?: FileState;
	collectionName?: string;
	type: CustomMediaPlayerType;
};

export const useTextTracks = ({
	fileState,
	collectionName,
	type,
}: UseTextTracksProps): {
	textTracks: VideoTextTracks;
	verifyUserCaptionsEnabled: () => void;
	areCaptionsEnabled: boolean;
	setSelectedTracksIndex: Dispatch<SetStateAction<number>>;
	setAreCaptionsEnabled: Dispatch<SetStateAction<boolean>>;
} => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const mediaClient = useMediaClient();
	const captionsObjectURLsStatus = useRef<Map<string, 'loading' | 'loaded' | 'error' | undefined>>(
		new Map(),
	);
	const captionsObjectURLs = useRef<Map<string, string>>(new Map());
	const intl = useIntl();
	const { mediaUserPreferences } = useMediaSettings() || {};
	const [captionTracks, setCaptionTracks] = useState<VideoTextTrack[]>([]);
	const [areCaptionsEnabled, setAreCaptionsEnabled] = useState(
		mediaUserPreferences ? getUserCaptionsEnabled(mediaUserPreferences) : false,
	);
	const [selectedTracksIndex, setSelectedTracksIndex] = useState(NO_SELECTED_TRACKS_INDEX);
	const resolvedSelectedTracksIndex = useMemo(() => {
		return areCaptionsEnabled ? selectedTracksIndex : NO_SELECTED_TRACKS_INDEX;
	}, [areCaptionsEnabled, selectedTracksIndex]);

	// When video starts playing, user settings might have changed
	const verifyUserCaptionsEnabled = useCallback((): void => {
		if (mediaUserPreferences) {
			setAreCaptionsEnabled(getUserCaptionsEnabled(mediaUserPreferences));
		}
	}, [mediaUserPreferences]);

	// Converts file artifacts to base text tracks, i.e. text tracks with a source creator function.
	// The src is resolved on every selected track change.
	useEffect(() => {
		if (!fileState || !hasArtifacts(fileState)) {
			setCaptionTracks([]);
			return;
		}
		const captionsArtifacts = Object.entries(fileState.artifacts || {}).filter(
			(caption): caption is [MediaUserArtifactCaptionKey, MediaUserArtifact] => {
				const [key, value] = caption;
				return key.includes('ugc_caption') && !!value;
			},
		);

		setCaptionTracks(
			captionsArtifacts
				.map(([artifactName, { mimeType }]): VideoTextTrack => {
					const { lang, label } = decodeMimetype(mimeType);
					const src = captionsObjectURLs.current.get(artifactName);
					return { lang, label, artifactName, src };
				})
				// Sort based on current locale
				.sort((a, b) => a.lang.localeCompare(b.lang, intl.locale)),
		);
	}, [fileState, intl.locale]);

	// Update the user caption enabled preferences
	useEffect(() => {
		if (mediaUserPreferences) {
			setUserCaptionsEnabled(mediaUserPreferences, areCaptionsEnabled);
		}
	}, [mediaUserPreferences, areCaptionsEnabled]);

	// Update the user locale preferences
	useEffect(() => {
		const { lang } = captionTracks[resolvedSelectedTracksIndex] || {};
		if (mediaUserPreferences && lang) {
			setUserCaptionsLocale(mediaUserPreferences, lang);
		}
	}, [mediaUserPreferences, captionTracks, resolvedSelectedTracksIndex]);

	// Reset the selected track index when the locale or text tracks change
	useEffect(() => {
		const preselectedTrackIndex = findPreselectedTrackIndex(
			captionTracks,
			intl.locale,
			mediaUserPreferences && getUserCaptionsLocale(mediaUserPreferences),
		);

		setSelectedTracksIndex(preselectedTrackIndex || 0);
	}, [mediaUserPreferences, intl.locale, captionTracks]);

	useEffect(() => {
		if (fileState && hasArtifacts(fileState)) {
			const { artifactName, src } = captionTracks[resolvedSelectedTracksIndex] || {};

			if (artifactName && !src && !captionsObjectURLsStatus.current.get(artifactName)) {
				const traceContext: MediaTraceContext = {
					traceId: getRandomTelemetryId(),
				};
				captionsObjectURLsStatus.current.set(artifactName, 'loading');
				mediaClient.mediaStore
					.getArtifactBinary(fileState.artifacts, artifactName, {
						collectionName,
					})
					.then((blob) => {
						const objectUrl = URL.createObjectURL(blob);
						captionsObjectURLs.current.set(artifactName, objectUrl);

						setCaptionTracks((prevCaptionTracks) => {
							const newCaptionTracks = [...prevCaptionTracks];
							newCaptionTracks[resolvedSelectedTracksIndex] = {
								...newCaptionTracks[resolvedSelectedTracksIndex],
								src: objectUrl,
							};
							return newCaptionTracks;
						});
						captionsObjectURLsStatus.current.set(artifactName, 'loaded');
					})
					.catch((error) => {
						const captionAttributes = {
							selectedTrackIndex: resolvedSelectedTracksIndex,
							availableCaptionTracks: captionTracks?.length || 0,
							selectedTrackLanguage: captionTracks?.[resolvedSelectedTracksIndex]?.lang || null,
							artifactName,
						};

						fireAnalyticsEvent(
							createCaptionDisplayFailedEventPayload(
								type,
								'fetch-fail',
								captionAttributes,
								fileState.id,
								error,
								traceContext,
							),
							createAnalyticsEvent,
						);
						captionsObjectURLsStatus.current.set(artifactName, 'error');
					});
			}
		}
	}, [
		resolvedSelectedTracksIndex,
		captionTracks,
		mediaClient,
		fileState,
		collectionName,
		createAnalyticsEvent,
		type,
	]);

	// Revokes the object urls when the component unmounts.
	useEffect(() => {
		const currentCaptionsObjectURLs = captionsObjectURLs.current;
		return () => {
			currentCaptionsObjectURLs.forEach((objectUrl) => {
				URL.revokeObjectURL(objectUrl);
			});
		};
	}, []);

	const textTracks: VideoTextTracks = useMemo(() => {
		return {
			captions: {
				selectedTrackIndex: resolvedSelectedTracksIndex,
				tracks: captionTracks,
			},
		};
	}, [captionTracks, resolvedSelectedTracksIndex]);

	return {
		textTracks,
		verifyUserCaptionsEnabled,
		areCaptionsEnabled,
		setSelectedTracksIndex,
		setAreCaptionsEnabled,
	};
};
