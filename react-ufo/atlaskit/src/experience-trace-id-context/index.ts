/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import type { TraceIdContext } from '@atlaskit/react-ufo/types'` instead.
 */

export type { TraceIdContext } from './types';

/**
 * @deprecated Use `import { generateSpanId } from '@atlaskit/react-ufo/generate-span-id'` instead.
 */
export { generateSpanId } from './generate-span-id';
/**
 * @deprecated Use `import { setInteractionActiveTrace } from '@atlaskit/react-ufo/set-interaction-active-trace'` instead.
 */
export { setInteractionActiveTrace } from './set-interaction-active-trace';
/**
 * @deprecated Use `import { setActiveTrace } from '@atlaskit/react-ufo/set-active-trace'` instead.
 */
export { setActiveTrace } from './set-active-trace';
/**
 * @deprecated Use `import { getActiveTrace } from '@atlaskit/react-ufo/get-active-trace'` instead.
 */
export { getActiveTrace } from './get-active-trace';
/**
 * @deprecated Use `import { clearActiveTrace } from '@atlaskit/react-ufo/clear-active-trace'` instead.
 */
export { clearActiveTrace } from './clear-active-trace';
/**
 * @deprecated Use `import { getActiveTraceHttpRequestHeaders } from '@atlaskit/react-ufo/get-active-trace-http-request-headers'` instead.
 */
export { getActiveTraceHttpRequestHeaders } from './get-active-trace-http-request-headers';
/**
 * @deprecated Use `import { getActiveTraceAsQueryParams } from '@atlaskit/react-ufo/get-active-trace-as-query-params'` instead.
 */
export { getActiveTraceAsQueryParams } from './get-active-trace-as-query-params';
/**
 * @deprecated Use `import { state } from '@atlaskit/react-ufo/state'` instead.
 */
export { state } from './state';
/**
 * @deprecated Use `import { traceIdKey } from '@atlaskit/react-ufo/trace-id-key'` instead.
 */
export { traceIdKey } from './trace-id-key';
/**
 * @deprecated Use `import { spanIdKey } from '@atlaskit/react-ufo/span-id-key'` instead.
 */
export { spanIdKey } from './span-id-key';
/**
 * @deprecated Use `import { experienceTypeKey } from '@atlaskit/react-ufo/experience-type-key'` instead.
 */
export { experienceTypeKey } from './experience-type-key';
