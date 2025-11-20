import type { ShapeTokenSchema, ValueSchema } from '../../../src/types';
import type { ShapePaletteToken } from '../../palettes/shape-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/shape/shape.tsx'
 */
const shape: ValueSchema<ShapeTokenSchema<ShapePaletteToken>> = {
	border: {
		width: {
			'[default]': { value: 'BorderWidth1' },
			selected: { value: 'BorderWidth2' },
			focused: { value: 'BorderWidth2' },
		},
	},
	radius: {
		xsmall: { value: 'Radius02' },
		small: { value: 'Radius04' },
		medium: { value: 'Radius06' },
		large: { value: 'Radius08' },
		xlarge: { value: 'Radius12' },
		xxlarge: { value: 'Radius16' },
		full: { value: 'Radius99' },
		tile: { value: 'RadiusPercentage25' },
	},
};

export default shape;
