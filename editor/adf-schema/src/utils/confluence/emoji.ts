/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
import type { acNameToEmojiMap } from './acNameToEmojiMap';

// Default emoji id for Confluence glyphs that has no match to Fabric Emoji
export const DEFAULT_EMOJI_ID = '2b50';

// Default ac:name for emoticons as a fallback is `blue-star`
export const DEFAULT_EMOJI_ACNAME = 'blue-star';

// ac:hipchat-emoticon prefix when converting to Emoji ID
export const HC_EMOTICON_PREFIX = 'atlassian-';

export type NameToEmoji = keyof typeof acNameToEmojiMap;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { acNameToEmoji } from './acNameToEmoji';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { emojiIdToAcName } from './emojiIdToAcName';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { acShortcutToEmoji } from './acShortcutToEmoji';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { getEmojiAcName } from './getEmojiAcName';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { acNameToEmojiMap } from './acNameToEmojiMap';
