/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import UFOSegment from './segment';

export default UFOSegment;
/**
 * @deprecated Use `import { UFOThirdPartySegment } from '@atlaskit/react-ufo/third-party-segment'` instead.
 */
export { UFOThirdPartySegment } from './third-party-segment';
export { type IframeSegmentEvent } from './third-party-segment';
/**
 * @deprecated Use `import { UFOGenAISegment } from '@atlaskit/react-ufo/gen-ai-segment'` instead.
 */
export { UFOGenAISegment } from './gen-ai-segment';
export type { Segment3pTimingEntry } from '../common';
/**
 * @deprecated Use `import { flushSsrRenderProfilerTraces } from '@atlaskit/react-ufo/ssr-render-profiler'` instead.
 */
export { flushSsrRenderProfilerTraces } from './ssr-render-profiler/flush-traces';
