import { type RequestErrorMetadata } from '../utils/request';
import type { MediaHeaders } from './MediaHeaders';

export const defaultMetadata: RequestErrorMetadata & MediaHeaders = {
	attempts: 5,
	clientExhaustedRetries: true,
	mediaRegion: 'test-media-region',
	mediaEnv: 'test-media-env',
	traceContext: { traceId: 'some-trace', spanId: 'some-span' },
};
