import type { EmojiDescription } from '../types';
import { selectedProductivityColorStorageKey } from './constants';
import storageAvailable from './storage-available';

export const productivityColors = [
	'gray',
	'magenta',
	'purple',
	'blue',
	'teal',
	'green',
	'lime',
	'yellow',
	'orange',
	'red',
] as const;

export type ProductivityColor = (typeof productivityColors)[number];

const productivityColorSet = new Set<string>(productivityColors);
const zeroSquareVariantParent = '0_zero_square_blue';

export const defaultProductivityColor: ProductivityColor = 'blue';

const isProductivityColor = (color: string | null): color is ProductivityColor =>
	!!color && productivityColorSet.has(color);

export const getStoredProductivityColor = (): ProductivityColor => {
	if (typeof window === 'undefined' || !storageAvailable('localStorage')) {
		return defaultProductivityColor;
	}

	try {
		const storedColor = window.localStorage.getItem(selectedProductivityColorStorageKey);
		return isProductivityColor(storedColor) ? storedColor : defaultProductivityColor;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('failed to load selected productivity emoji colour', error);
		return defaultProductivityColor;
	}
};

export const storeProductivityColor = (color: ProductivityColor): void => {
	if (typeof window === 'undefined' || !storageAvailable('localStorage')) {
		return;
	}

	try {
		window.localStorage.setItem(selectedProductivityColorStorageKey, color);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('failed to store selected productivity emoji colour', error);
	}
};

type ProductivityVariant = {
	color: ProductivityColor;
};

const getProductivityVariant = (emoji: EmojiDescription): ProductivityVariant | undefined => {
	if (emoji.type !== 'ATLASSIAN' || !emoji.color || !productivityColorSet.has(emoji.color)) {
		return undefined;
	}

	return {
		color: emoji.color as ProductivityColor,
	};
};

export const getProductivityColor = (emoji: EmojiDescription): ProductivityColor | undefined =>
	getProductivityVariant(emoji)?.color;

export const isProductivityNumberEmoji = (emoji: EmojiDescription): boolean =>
	getProductivityColor(emoji) !== undefined;

export const filterProductivityEmojisByColor = (
	emojis: EmojiDescription[],
	selectedColor: ProductivityColor,
): EmojiDescription[] => {
	return emojis.filter((emoji) => {
		const variant = getProductivityVariant(emoji);

		return !variant || variant.color === selectedColor;
	});
};

const isZeroSquareProductivityEmoji = (emoji: EmojiDescription): boolean =>
	emoji.variantParent === zeroSquareVariantParent ||
	emoji.variantChildren?.some((variantChild) => variantChild.includes('0_zero_square_')) ||
	!!(
		emoji.variantBase &&
		emoji.keywords?.includes('0') &&
		emoji.variantChildren?.some((variantChild) => variantChild.includes('_square_'))
	);

export const getProductivityColorPreviewEmojis = (
	emojis: EmojiDescription[],
): Partial<Record<ProductivityColor, EmojiDescription>> =>
	emojis.reduce<Partial<Record<ProductivityColor, EmojiDescription>>>((previewEmojis, emoji) => {
		const color = getProductivityColor(emoji);

		if (!color) {
			return previewEmojis;
		}

		if (isZeroSquareProductivityEmoji(emoji) || !previewEmojis[color]) {
			previewEmojis[color] = emoji;
		}

		return previewEmojis;
	}, {});
