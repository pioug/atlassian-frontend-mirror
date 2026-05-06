import { type ShadowToken } from '../types';

import { hexToRGBAValues } from './hex-to-rgba-values';
/**
 * Returns a box shadow formatted for CSS from a ShadowToken raw value.
 *
 * @param rawShadow - ShadowToken raw value
 */
export const getBoxShadow = (rawShadow: ShadowToken<string>['value']): string =>
	rawShadow
		.map(({ radius, offset, color, opacity }) => {
			const { r, g, b } = hexToRGBAValues(color);

			return `${offset.x}px ${offset.y}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`;
		})
		.join(',');

export { hexToRGBAValues } from './hex-to-rgba-values';
