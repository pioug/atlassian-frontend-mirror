/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import type { ResourceTiming, ResourceTimings, ResourceTimingsConfig } from '@atlaskit/react-ufo/resource-timing/types'` instead.
 */

export type { ResourceTiming, ResourceTimings, ResourceTimingsConfig } from './common/types';
/**
 * @deprecated Use `import { configure } from '@atlaskit/react-ufo/resource-timing/config'` instead.
 */
export { configure } from './common/utils/config';
/**
 * @deprecated Use `import { getResourceTimings } from '@atlaskit/react-ufo/resource-timing/main'` instead.
 */
export { getResourceTimings } from './main';
/**
 * @deprecated Use `import { startResourceTimingBuffer } from '@atlaskit/react-ufo/resource-timing/utils'` instead.
 */
export { startResourceTimingBuffer } from './utils';
