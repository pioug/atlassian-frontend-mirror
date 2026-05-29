import type { TransformedToken } from 'style-dictionary';

export const fontTokenToCSS = ({
	value: { fontSize, fontStyle, fontWeight, lineHeight, fontFamily },
}: TransformedToken) => {
	return `${fontStyle} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
};
