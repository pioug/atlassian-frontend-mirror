import type { AnnotationMarkDefinition } from '@atlaskit/adf-schema/annotation';
import type { EmojiDefinition, EmojiAttributes } from '@atlaskit/adf-schema/emoji';

export const emoji = (
	attrs: EmojiAttributes,
	options?: { marks: AnnotationMarkDefinition[] },
): EmojiDefinition => {
	if (options?.marks) {
		return {
			type: 'emoji',
			attrs,
			marks: options?.marks,
		};
	}
	return {
		type: 'emoji',
		attrs,
	};
};
