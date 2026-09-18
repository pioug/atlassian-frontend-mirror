/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { Ellipsify } from './Ellipsify-2';

/**
 * @deprecated Use `import type { EllipsifyProps } from '@atlaskit/media-ui/ellipsify/compiled/ellipsify'` instead.
 */
export type { EllipsifyProps } from './Ellipsify-3';

/**
 * @deprecated Use `import { Ellipsify } from '@atlaskit/media-ui/ellipsify/ellipsify'` instead.
 */
export default Ellipsify;

/**
 * @deprecated Use `import { Ellipsify } from '@atlaskit/media-ui/ellipsify/ellipsify'` instead.
 */
export { Ellipsify };
