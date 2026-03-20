import type { EmojiId } from './src/types';

const _default_1: {
	optimisticImageApi: {
		getUrl: (emojiId: EmojiId) => string;
		securityProvider: () => {
			headers: {
				Authorization: string;
				'User-Context': string;
			};
		};
	};
	providers: (
		| {
				url: string;
		  }
		| {
				securityProvider: () => {
					headers: {
						Authorization: string;
					};
				};
				url: string;
		  }
	)[];
	recordConfig: {
		url: string;
	};
	singleEmojiApi: {
		getUrl: (emojiId: EmojiId) => string;
		securityProvider: () => {
			headers: {
				Authorization: string;
				'User-Context': string;
			};
		};
	};
} = {
	recordConfig: {
		url: 'https://www.example.org/',
	},
	providers: [
		{
			url: 'https://www.example.org/emoji/standard',
		},
		{
			url: 'https://www.example.org/emoji/site-id/site',
			securityProvider: () => ({
				headers: {
					Authorization: 'Bearer token',
				},
			}),
		},
	],
	singleEmojiApi: {
		getUrl: (emojiId: EmojiId) =>
			`https://www.example.org/emoji/${emojiId.id || emojiId.shortName}`,
		securityProvider: () => ({
			headers: {
				'User-Context': '{token}',
				Authorization: 'Bearer {token}',
			},
		}),
	},
	optimisticImageApi: {
		getUrl: (emojiId: EmojiId) =>
			`http://www.example.org/emoji/site-id/${emojiId.id || emojiId.shortName}/path`,
		securityProvider: () => ({
			headers: {
				'User-Context': '{token}',
				Authorization: 'Bearer {token}',
			},
		}),
	},
};
export default _default_1;
