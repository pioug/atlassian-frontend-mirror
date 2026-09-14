import type { MediaClientConfig } from '@atlaskit/media-core/auth';

import { type MediaEnv, mediaPickerAuthProvider } from './mediaPickerAuthProvider';

export const createUploadMediaClientConfig = (
	stargateBaseUrl?: string,
	env?: MediaEnv,
): MediaClientConfig => ({
	authProvider: mediaPickerAuthProvider('asap', env),
	stargateBaseUrl,
});
