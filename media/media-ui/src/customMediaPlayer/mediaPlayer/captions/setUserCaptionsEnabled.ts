import type { MediaUserPreferences } from '@atlaskit/media-client-react/get-media-user-preferences';

export const setUserCaptionsEnabled = (
	mediaUserPreferences: MediaUserPreferences,
	areCaptionsEnabled: boolean,
): void => {
	mediaUserPreferences.set('videoCaptionsEnabled', areCaptionsEnabled);
};
