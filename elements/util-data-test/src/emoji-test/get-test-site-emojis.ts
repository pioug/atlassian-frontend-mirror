import { getTestMediaApiToken } from './get-test-media-api-token';
import { mediaEmoji } from './media-emoji';

export const getTestSiteEmojis = (): {
	emojis: {
		altRepresentation: {
			height: number;
			mediaPath: 'https://media.example.com/alt-path-to-image.png';
			width: number;
		};
		category: string;
		fallback: string;
		id: string;
		name: string;
		order: number;
		representation: {
			height: number;
			mediaPath: 'https://media.example.com/path-to-image.png';
			width: number;
		};
		searchable: boolean;
		shortName: string;
		skinVariations: never[];
		type: string;
	}[];
	meta: {
		mediaApiToken: {
			clientId: string;
			collectionName: string;
			expiresAt: number;
			jwt: string;
			url: string;
		};
	};
} => ({
	emojis: [mediaEmoji],
	meta: {
		mediaApiToken: getTestMediaApiToken(),
	},
});
