import {
	customCategory,
	customType,
	mediaEmojiAlternateImagePath,
	mediaEmojiImagePath,
} from '../emoji-constants';

export const mediaServiceEmoji: {
	altRepresentations: {
		XHDPI: {
			height: number;
			imagePath: 'https://media.example.com/alt-path-to-image.png';
			width: number;
		};
	};
	category: string;
	fallback: string;
	id: string;
	name: string;
	order: number;
	representation: {
		height: number;
		imagePath: 'https://media.example.com/path-to-image.png';
		width: number;
	};
	searchable: boolean;
	shortName: string;
	type: string;
} = {
	id: 'media',
	shortName: ':media:',
	name: 'Media example',
	fallback: ':media:',
	type: customType,
	category: customCategory,
	order: -2,
	representation: {
		imagePath: mediaEmojiImagePath,
		width: 24,
		height: 24,
	},
	altRepresentations: {
		XHDPI: {
			imagePath: mediaEmojiAlternateImagePath,
			width: 48,
			height: 48,
		},
	},
	searchable: true,
};
