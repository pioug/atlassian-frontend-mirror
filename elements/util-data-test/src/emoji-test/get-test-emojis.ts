import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getTestAtlassianEmojis } from './get-test-atlassian-emojis';
import { getTestSiteEmojis } from './get-test-site-emojis';
import { getTestStandardEmojis } from './get-test-standard-emojis';
import type { EmojiDescriptionWithVariations } from '@atlaskit/emoji';

export const getTestEmojis = (): (
	| EmojiDescriptionWithVariations
	| {
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
	  }
)[] => [
	...denormaliseEmojiServiceResponse(getTestStandardEmojis()).emojis,
	...denormaliseEmojiServiceResponse(getTestAtlassianEmojis()).emojis,
	...getTestSiteEmojis().emojis,
];
