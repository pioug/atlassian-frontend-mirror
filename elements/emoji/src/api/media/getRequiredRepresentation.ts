import type { EmojiDescription, EmojiRepresentation } from '../../types';

export const getRequiredRepresentation = (
	emoji: EmojiDescription,
	useAlt?: boolean,
): EmojiRepresentation => (useAlt ? emoji.altRepresentation : emoji.representation);
