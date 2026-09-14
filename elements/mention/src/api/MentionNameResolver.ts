/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type { MentionNameResolver } from '../types';

/**
 * @deprecated Use `import { DefaultMentionNameResolver } from '@atlaskit/mention/mention-name-resolver'` instead.
 */
export { DefaultMentionNameResolver } from './DefaultMentionNameResolver';
/**
 * @deprecated Use `import { mergeNameResolverQueues } from '@atlaskit/mention/mention-name-resolver'` instead.
 */
export { mergeNameResolverQueues } from './mergeNameResolverQueues';
/**
 * @deprecated Use `import { Callback } from '@atlaskit/mention/mention-name-resolver'` instead.
 */
export type { Callback } from './Callback';
/**
 * @deprecated Use `import { Queue } from '@atlaskit/mention/mention-name-resolver'` instead.
 */
export type { Queue } from './Queue';
