import { MediaClient } from '..';
import { createUploadMediaClientConfig } from './createUploadMediaClientConfig';

export const createUploadMediaClient = (): MediaClient =>
	new MediaClient(createUploadMediaClientConfig());
