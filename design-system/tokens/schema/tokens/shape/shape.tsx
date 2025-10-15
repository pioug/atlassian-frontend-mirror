import type { AttributeSchema, ShapeTokenSchema } from '../../../src/types';
import type { ShapePaletteToken } from '../../palettes/shape-palette';

const shape: AttributeSchema<ShapeTokenSchema<ShapePaletteToken>> = {
	border: {
		width: {
			'[default]': {
				attributes: {
					group: 'shape',
					state: 'active',
					suggest: ['1px'],
					introduced: '1.5.2',
					description: 'The default width for all standard component borders and dividers.',
				},
			},
			selected: {
				attributes: {
					group: 'shape',
					state: 'active',
					suggest: ['2px'],
					introduced: '6.1.0',
					description:
						'The width used to indicate a selected element, such as an active tab or a chosen item.',
				},
			},
			focused: {
				attributes: {
					group: 'shape',
					state: 'active',
					suggest: ['2px'],
					introduced: '6.1.0',
					description: 'The width used for the focus ring on interactive elements.',
				},
			},
		},
	},
	radius: {
		xsmall: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['2px'],
				introduced: '6.1.0',
				description: 'Used for small containers such as badges.',
			},
		},
		small: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['4px'],
				introduced: '6.1.0',
				description: 'Used for labels.',
			},
		},
		medium: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['6px'],
				introduced: '6.1.0',
				description: 'Used for buttons and inputs.',
			},
		},
		large: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['8px'],
				introduced: '6.1.0',
				description: 'Used for cards and small containers.',
			},
		},
		xlarge: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['12px'],
				introduced: '6.1.0',
				description: 'Used for modals and large containers.',
			},
		},
		full: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['50%'],
				introduced: '6.1.0',
				description: 'Used for circular containers, like a rounded button.',
			},
		},
		tile: {
			attributes: {
				group: 'shape',
				state: 'active',
				introduced: '6.2.0',
				description: 'Used for tiles only.',
			},
		},
	},
};
export default shape;
