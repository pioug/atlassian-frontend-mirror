import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import type { UploadParams } from '@atlaskit/media-picker/types';

export type MediaProvider = {
	uploadParams?: UploadParams;

	/**
	 * (optional) Used for creating new uploads and finalizing files.
	 * NOTE: We currently don't accept MediaClientConfig, because we need config properties
	 *       to initialize
	 */
	uploadMediaClientConfig?: MediaClientConfig;

	/**
	 * Used for displaying Media Cards and downloading files.
	 */
	viewMediaClientConfig: MediaClientConfig;
	/**
	 * Used for displaying and downloading files OR uploading files. The operation will be determined by Media on each request.
	 * This will be a replacement for viewMediaClientConfig and uploadMediaClientConfig together
	 */
	viewAndUploadMediaClientConfig?: MediaClientConfig;
};
