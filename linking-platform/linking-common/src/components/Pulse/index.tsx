/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Pulse } from './Pulse';

export default Pulse;

/**
 * @deprecated Use `import { Pulse } from '@atlaskit/linking-common/pulse'` instead.
 */
export { Pulse } from './Pulse';
export type { PulseProps } from './Pulse';
