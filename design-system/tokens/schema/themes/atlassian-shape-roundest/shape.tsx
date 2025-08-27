import type { ShapeTokenSchema, ValueSchema } from '../../../src/types';
import type { ShapePaletteToken } from '../../palettes/shape-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/shape/shape.tsx'
 */
const shape: ValueSchema<ShapeTokenSchema<ShapePaletteToken>> = {
	border: {
		width: {
			outline: { value: 'BorderWidth2' },
			'0': { value: 'Size0' },
			indicator: { value: 'Size200' },
			'[default]': { value: 'BorderWidth1' },
			selected: { value: 'BorderWidth2' },
			focused: { value: 'BorderWidth2' },
		},
		radius: {
			'[default]': { value: 'Radius04' },
			'050': { value: 'Radius02' },
			'100': { value: 'Radius04' },
			'200': { value: 'Radius08' },
			'300': { value: 'Radius12' },
			'400': { value: 'Radius16' },
			circle: { value: 'Radius99' },
		},
	},
	radius: {
		xsmall: { value: 'Radius02' },
		small: { value: 'Radius04' },
		medium: { value: 'Radius12' },
		large: { value: 'Radius16' },
		xlarge: { value: 'Radius20' },
		full: { value: 'Radius99' },
	},
};

export default shape;
