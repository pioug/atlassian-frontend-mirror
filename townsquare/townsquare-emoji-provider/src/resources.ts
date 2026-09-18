import type UploadingEmojiResource from '@atlaskit/emoji/emoji-resource';

/**
 * Per cloudId/user/upload-mode cache of emoji resources.
 */
export const resources: Map<string, UploadingEmojiResource> = new Map();
