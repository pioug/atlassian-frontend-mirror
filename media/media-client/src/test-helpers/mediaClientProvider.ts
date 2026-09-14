/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
export const defaultBaseUrl = 'https://media.staging.atl-paas.net';

export const defaultParams: {
	clientId: string;
	asapIssuer: string;
	baseUrl: string;
} = {
	clientId: '5a9812fc-d029-4a39-8a46-d3cc36eed7ab',
	asapIssuer: 'micros/media-playground',
	baseUrl: defaultBaseUrl,
};

/**
 * @deprecated Use `import { createStorybookMediaClient } from '@atlaskit/media-client/test-helpers'` instead.
 */
export { createStorybookMediaClient } from './createStorybookMediaClient';
/**
 * @deprecated Use `import { createStorybookMediaClientConfig } from '@atlaskit/media-client/test-helpers'` instead.
 */
export { createStorybookMediaClientConfig } from './createStorybookMediaClientConfig';
/**
 * @deprecated Use `import { createUploadMediaClient } from '@atlaskit/media-client/test-helpers'` instead.
 */
export { createUploadMediaClient } from './createUploadMediaClient';
/**
 * @deprecated Use `import { createUploadMediaClientConfig } from '@atlaskit/media-client/test-helpers'` instead.
 */
export { createUploadMediaClientConfig } from './createUploadMediaClientConfig';
/**
 * @deprecated Use `import { AuthParameter } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export type { AuthParameter } from './AuthParameter';
/**
 * @deprecated Use `import { defaultAuthParameter } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export { defaultAuthParameter } from './defaultAuthParameter';
