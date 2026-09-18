/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import type { VCObserverInterface } from './types';

export type { VCRevisionDebugDetails } from './vc-observer/getVCRevisionDebugDetails';

declare global {
	var __vcObserver: VCObserverInterface;
}
/**
 * @deprecated Use `import { VCObserverWrapper } from '@atlaskit/react-ufo/vc-observer-wrapper'` instead.
 */
export { VCObserverWrapper } from './VCObserverWrapper';
/**
 * @deprecated Use `import { isEnvironmentSupported } from '@atlaskit/react-ufo/is-environment-supported'` instead.
 */
export { isEnvironmentSupported } from './isEnvironmentSupported';
/**
 * @deprecated Use `import { getVCObserver } from '@atlaskit/react-ufo/get-vc-observer'` instead.
 */
export { getVCObserver } from './getVCObserver';
/**
 * @deprecated Use `import { newVCObserver } from '@atlaskit/react-ufo/new-vc-observer'` instead.
 */
export { newVCObserver } from './newVCObserver';
