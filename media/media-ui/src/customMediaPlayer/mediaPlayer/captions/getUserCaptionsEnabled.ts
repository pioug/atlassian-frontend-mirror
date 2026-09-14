import type { MediaUserPreferences } from '@atlaskit/media-client-react/get-media-user-preferences';

export const getUserCaptionsEnabled = (mediaUserPreferences: MediaUserPreferences): boolean =>
	!!mediaUserPreferences.get('videoCaptionsEnabled');
