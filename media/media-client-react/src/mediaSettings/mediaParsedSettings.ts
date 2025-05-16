import { useMemo } from 'react';

import { defaultMediaUserPreferences, type MediaUserPreferences } from './getMediaUserPreferences';

export type MediaSettings = {
	canUpdateVideoCaptions?: boolean;
};

export type MediaParsedSettings = MediaSettings & {
	mediaUserPreferences?: MediaUserPreferences;
};

export const useMediaParsedSettings = (mediaSettings: MediaSettings = {}): MediaParsedSettings => {
	const settings = useMemo(() => {
		const newSettings: MediaParsedSettings = { ...mediaSettings };
		newSettings.mediaUserPreferences = defaultMediaUserPreferences;

		return newSettings;
	}, [mediaSettings]);

	return settings;
};
