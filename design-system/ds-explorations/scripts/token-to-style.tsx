import type { CSSProperties } from 'react';

import type { ShadowDefintion } from './types';

const constructShadow = (shadowObject: ShadowDefintion) => {
	return shadowObject
		.map((shadow) => `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px ${shadow.color}`)
		.join(', ');
};

export const tokenToStyle: (
	prop: keyof CSSProperties,
	token: string,
	fallback: string | ShadowDefintion,
) => string = (prop: keyof CSSProperties, token: string, fallback: string | ShadowDefintion) => {
	if (Array.isArray(fallback)) {
		fallback = constructShadow(fallback);
	}
	return `css({\n\t${prop}: token('${token}', '${fallback}')\n})`;
};
