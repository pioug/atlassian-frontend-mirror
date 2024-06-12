import type { Transform } from 'style-dictionary';

const rawNumberToPixel = (value: unknown) => {
	if (typeof value === 'number') {
		return `${value}px`;
	}

	return value;
};

/**
 * transform a value from a raw number to a pixelised value
 */
const rawNumberToPixelTransform: Transform = {
	type: 'value',
	matcher: (token) => {
		return ['spacing', 'shape', 'typography', 'lineHeight', 'fontSize'].includes(
			token.attributes?.group,
		);
	},
	transformer: ({ value, attributes }) => {
		if (attributes?.group === 'typography') {
			return {
				...value,
				fontSize: rawNumberToPixel(value.fontSize),
				lineHeight: rawNumberToPixel(value.lineHeight),
			};
		}

		return rawNumberToPixel(value);
	},
};

export default rawNumberToPixelTransform;
