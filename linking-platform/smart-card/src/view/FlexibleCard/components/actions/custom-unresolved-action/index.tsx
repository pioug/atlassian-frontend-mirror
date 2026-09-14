/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { type MessageDescriptor } from 'react-intl';

import { CustomUnresolvedAction } from './CustomUnresolvedAction';

export type AccessType =
	| 'DIRECT_ACCESS'
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DENIED_REQUEST_EXISTS'
	| 'ACCESS_EXISTS'
	| undefined;

export type CustomStatusComponents = Partial<
	Record<NonNullable<AccessType> | 'FALLBACK', MessageDescriptor>
>;

export default CustomUnresolvedAction;

/**
 * @deprecated Use `import { CustomUnresolvedAction } from '@atlaskit/smart-card/custom-unresolved-action'` instead.
 */
export { CustomUnresolvedAction } from './CustomUnresolvedAction';
