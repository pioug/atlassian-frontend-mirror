import type { MediaUserPreferences } from '@atlaskit/media-client-react/get-media-user-preferences';

export const setUserCaptionsLocale = (
	mediaUserPreferences: MediaUserPreferences,
	locale: string,
): void => {
	mediaUserPreferences.set('videoCaptionsPreferredLocale', locale);
};
