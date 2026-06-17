import type { EmojiDescription } from '../types';

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
