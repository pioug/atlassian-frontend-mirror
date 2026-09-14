import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import {
	type EmojiMeta,
	type EmojiRepresentation,
	type EmojiServiceDescription,
	ProviderTypes,
	type UnicodeRepresentation,
} from '../types';
import { emojiIdToEmoji } from '../util/emojiIdToEmoji';
import { denormaliseServiceRepresentation } from './denormaliseServiceRepresentation';

export const denormaliseStandardRepresentation = (
	emoji: EmojiServiceDescription,
	meta?: EmojiMeta,
): EmojiRepresentation => {
	const unicodeEmoji = emojiIdToEmoji(emoji.id);
	const useUnicodeRepresentation: boolean = !!(
		emoji.id &&
		emoji.type === ProviderTypes.STANDARD &&
		unicodeEmoji &&
		expValEqualsNoExposure('platform_use_unicode_emojis', 'isEnabled', true)
	);

	return useUnicodeRepresentation
		? ({ unicodeEmoji } as UnicodeRepresentation)
		: denormaliseServiceRepresentation(emoji.representation, meta);
};
