/**
 * This file has been partially duplicated in packages/editor/adf-schema/src/utils/url.ts
 * Any changes made here should be mirrored there until the duplicate behaviour is resolved
 * Ticket for dedeplication: https://product-fabric.atlassian.net/browse/EDM-7138
 * Ticket for fixing linkification of filename-like urls: https://product-fabric.atlassian.net/browse/EDM-7190
 */

export interface Match {
	index: number;
	input?: string;
	lastIndex: number;
	length?: number;
	raw: string;
	schema: any;
	text: string;
	url: string;
}

/**
 * @deprecated Use `import { linkifyMatch } from '@atlaskit/linking-common/linkify-match'` instead.
 */
export { linkifyMatch } from './linkifyMatch';
/**
 * @deprecated Use `import { isSafeUrl } from '@atlaskit/linking-common/is-safe-url'` instead.
 */
export { isSafeUrl } from './isSafeUrl';
/**
 * @deprecated Use `import { normalizeUrl } from '@atlaskit/linking-common/normalize-url'` instead.
 */
export { normalizeUrl } from './normalizeUrl';
