// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';
import type { EmojiUpload } from '@atlaskit/emoji/types';
import { customCategory, customType } from '../emoji-constants';
import { loggedUser } from './logged-user';

export const emojiFromUpload = (
	upload: EmojiUpload,
): {
	category: string;
	creatorUserId: string;
	fallback: string; // eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	id: any;
	name: string;
	order: number;
	representation: {
		height: number;
		imagePath: string;
		width: number;
	};
	searchable: boolean;
	shortName: string;
	type: string;
} => {
	const { shortName, name, dataURL, height, width } = upload;
	return {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		id: uuid(),
		shortName,
		name,
		fallback: shortName,
		type: customType,
		category: customCategory,
		order: -1,
		creatorUserId: loggedUser,
		representation: {
			width,
			height,
			imagePath: dataURL,
		},
		searchable: true,
	};
};
