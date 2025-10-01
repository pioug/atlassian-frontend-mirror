import type { AttributeSchema, ShapeTokenSchema } from '../../../src/types';
import type { ShapePaletteToken } from '../../palettes/shape-palette';

const shape: AttributeSchema<ShapeTokenSchema<ShapePaletteToken>> = {
	border: {
		width: {
			'0': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.2.1',
					deprecated: '6.1.0',
					description: 'Used for zero width borders.',
				},
			},
			outline: {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.5.2',
					deprecated: '6.1.0',
					description: 'Used for focus, active or selected inputs.',
				},
			},
			indicator: {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.5.2',
					deprecated: '6.1.0',
					description: 'Used for indicators like tab and menu selected states.',
				},
			},
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
		radius: {
			'[default]': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.5.2',
					deprecated: '6.1.0',
					description: 'The default border radius.',
				},
			},
			'050': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.1.0',
					deprecated: '6.1.0',
					description: 'Used for selection indicators, like tabs.',
				},
			},
			'100': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.1.0',
					deprecated: '6.1.0',
					description: 'Used for buttons and inputs.',
				},
			},
			'200': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.1.0',
					deprecated: '6.1.0',
					description: 'Used for smaller cards.',
				},
			},
			'300': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.1.0',
					deprecated: '6.1.0',
					description: 'Used for cards and larger containers.',
				},
			},
			'400': {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.1.0',
					deprecated: '6.1.0',
					description: 'Used for modals.',
				},
			},
			circle: {
				attributes: {
					group: 'shape',
					state: 'deprecated',
					introduced: '1.1.0',
					deprecated: '6.1.0',
					description: 'Used for circular containers, like a rounded button.',
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
