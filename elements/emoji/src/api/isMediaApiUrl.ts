import { type EmojiMeta } from '../types';

export const isMediaApiUrl = (url: string, meta?: EmojiMeta): boolean =>
	!!(meta && meta.mediaApiToken && url.indexOf(meta.mediaApiToken.url) === 0);
