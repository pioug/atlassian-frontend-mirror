export const listItemCounterPadding = 24;

enum CSS_VAR_NAMES {
	ITEM_COUNTER_PADDING = `--ed--list--item-counter--padding`,
}

const getItemCounterLeftPadding = (itemCounterDigitsSize: number): string => {
	// Previous padding-left was approximately 24px. We approximate that
	// same value using "ch" units (which represent the width of a "0" digit
	// character). We use "ch" so that this computed padding can now grow if
	//  the font-size ever enlarges.
	let paddingLeft = `2.385ch`;

	if (itemCounterDigitsSize >= 2) {
		// When there are 2 or more digits, we use a combination of "ch" units and
		// pixel values so that while the computed padding grows if font-size ever
		// enlarges, it doesn't over-scale with each digit (because of the fixed pixel
		// portion of the computed value). This way, very large item counters will not
		// become overly left-padded.
		const fixedBasePx = 2;
		paddingLeft = `calc(${itemCounterDigitsSize + 1}ch - ${fixedBasePx}px)`;
	}
	return paddingLeft;
};

const stringifyStyle = (style: Record<string, string>) =>
	Object.entries(style).reduce((str, [key, value]) => `${str}${key}:${value};`, ``);

export function getOrderedListInlineStyles(
	itemCounterDigitsSize: number,
	styleFormat: 'string',
): string;
export function getOrderedListInlineStyles(
	itemCounterDigitsSize: number,
	styleFormat: 'object',
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any>;

export function getOrderedListInlineStyles(
	itemCounterDigitsSize: number,
	styleFormat: 'string' | 'object',
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): string | Record<string, any> {
	const style = {
		[CSS_VAR_NAMES.ITEM_COUNTER_PADDING]: getItemCounterLeftPadding(itemCounterDigitsSize),
	};
	if (styleFormat === 'string') {
		return stringifyStyle(style);
	}
	return style;
}
