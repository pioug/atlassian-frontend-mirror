import type { EmojiProvider } from '../api/EmojiResource';
import type { OptionalEmojiDescription } from '../types';
import { toneEmojiShortName } from './filters';

export const getToneEmoji = (
	provider: EmojiProvider,
): OptionalEmojiDescription | Promise<OptionalEmojiDescription> =>
	provider.findByShortName(toneEmojiShortName);
