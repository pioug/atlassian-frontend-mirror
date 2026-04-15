import {
	customCategory,
	customType,
	mediaEmojiAlternateImagePath,
	mediaEmojiImagePath,
} from '../emoji-constants';

export const mediaEmojiId = {
	id: 'media',
	shortName: ':media:',
	fallback: ':media:',
};

export const mediaEmoji: {
    altRepresentation: {
        height: number;
        mediaPath: "https://media.example.com/alt-path-to-image.png";
        width: number;
    }; category: string; fallback: string; id: string; name: string; order: number; representation: {
        height: number;
        mediaPath: "https://media.example.com/path-to-image.png";
        width: number;
    }; searchable: boolean; shortName: string; skinVariations: never[]; type: string;
} = {
	...mediaEmojiId,
	name: 'Media example',
	type: customType,
	category: customCategory,
	order: -2,
	representation: {
		mediaPath: mediaEmojiImagePath,
		width: 24,
		height: 24,
	},
	altRepresentation: {
		mediaPath: mediaEmojiAlternateImagePath,
		width: 48,
		height: 48,
	},
	skinVariations: [],
	searchable: true,
};
