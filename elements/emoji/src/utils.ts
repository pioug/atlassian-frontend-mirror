/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { defaultInlineEmojiHeight } from '@atlaskit/emoji/constants'` instead.
 */
export { defaultInlineEmojiHeight } from './util/constants';
/**
 * @deprecated Use `import { toEmojiId, toOptionalEmojiId } from '@atlaskit/emoji/type-helpers'` instead.
 */
export { toEmojiId } from './util/to-emoji-id';
export { toOptionalEmojiId } from './util/to-optional-emoji-id';
/**
 * @deprecated Use `import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { denormaliseEmojiServiceResponse } from './api/denormaliseEmojiServiceResponse';
/**
 * @deprecated Use `import { UsageFrequencyTracker } from '@atlaskit/emoji/usage-frequency-tracker'` instead.
 */
export { UsageFrequencyTracker } from './api/internal/UsageFrequencyTracker';
