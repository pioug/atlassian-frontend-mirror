import type { MediaUserPreferences } from '@atlaskit/media-client-react/get-media-user-preferences';

export const getUserCaptionsLocale = (
	mediaUserPreferences: MediaUserPreferences,
): string | undefined => mediaUserPreferences.get('videoCaptionsPreferredLocale');
