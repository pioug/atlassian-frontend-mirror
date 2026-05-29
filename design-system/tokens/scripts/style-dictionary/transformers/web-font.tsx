import type { Transform } from 'style-dictionary';

import { fontTokenToCSS } from './font-token-to-css';

/**
 * Transform a value from a raw number to a pixelised value.
 */
const fontTransform: Transform = {
	type: 'value',
	matcher: (token) => {
		return token.attributes?.group === 'typography';
	},
	transformer: fontTokenToCSS,
};

export default fontTransform;
export { fontTokenToCSS } from './font-token-to-css';
