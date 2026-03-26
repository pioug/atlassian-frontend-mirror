import type {
	EmojiDefinition,
	EmojiAttributes,
	AnnotationMarkDefinition,
} from '@atlaskit/adf-schema';

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
