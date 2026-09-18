/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/*
Entry point: ./test-helpers
*/

/**
 * @deprecated Use `import type { MockedMediaClientProviderProps } from '@atlaskit/media-client-react/mocked-media-client-provider'` instead.
 */

export type { MockedMediaClientProviderProps } from './MockedMediaClientProvider';
/**
 * @deprecated Use `import { MockedMediaClientProvider, mockedMediaClientConfig } from '@atlaskit/media-client-react/mocked-media-client-provider'` instead.
 */
export { MockedMediaClientProvider, mockedMediaClientConfig } from './MockedMediaClientProvider';
/**
 * @deprecated Use `import { mockedGetMediaClient } from '@atlaskit/media-client-react/mocked-get-media-client'` instead.
 */
export { mockedGetMediaClient } from './mockedGetMediaClient';

/**
 * @deprecated Use `import { MockedMediaProvider, MockedMediaProviderProps } from '@atlaskit/media-client-react/mocked-media-provider'` instead.
 */
export { MockedMediaProvider, type MockedMediaProviderProps } from './MockedMediaProvider';
