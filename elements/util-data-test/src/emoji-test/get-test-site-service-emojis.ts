import { getTestMediaApiToken } from './get-test-media-api-token';
import { mediaServiceEmoji } from './media-service-emoji';

export const getTestSiteServiceEmojis = (): {
    emojis: {
        altRepresentations: {
            XHDPI: {
                height: number;
                imagePath: "https://media.example.com/alt-path-to-image.png";
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
            imagePath: "https://media.example.com/path-to-image.png";
            width: number;
        };
        searchable: boolean;
        shortName: string;
        type: string;
    }[]; meta: {
        mediaApiToken: {
            clientId: string;
            collectionName: string;
            expiresAt: number;
            jwt: string;
            url: string;
        };
    };
} => ({
	emojis: [mediaServiceEmoji],
	meta: {
		mediaApiToken: getTestMediaApiToken(),
	},
});
