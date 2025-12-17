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
				description:
					'Use for small detail elements: badges, checkboxes, avatar labels, keyboard shortcuts.',
			},
		},
		small: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['4px'],
				introduced: '6.1.0',
				description:
					'Use for supporting elements: labels, lozenges, timestamps, tags, dates, tooltip containers, imagery inside a table, compact buttons.',
			},
		},
		medium: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['6px'],
				introduced: '6.1.0',
				description:
					'Use for interactive elements: buttons, inputs, text areas, selects, navigation items, smart links.',
			},
		},
		large: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['8px'],
				introduced: '6.1.0',
				description:
					'Use for containment elements: cards, in-page containers, floating UI, dropdown menus.',
			},
		},
		xlarge: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['12px'],
				introduced: '6.1.0',
				description:
					'Use for large page elements: full-page containers, large containers, modals, Kanban columns, tables.',
			},
		},
		xxlarge: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['12px'],
				introduced: '8.1.0',
				description: 'Use for video player containers.',
			},
		},
		full: {
			attributes: {
				group: 'shape',
				state: 'active',
				suggest: ['50%'],
				introduced: '6.1.0',
				description:
					'Use for circular elements (user/people related): avatars, names, user-related UI, emoji reactions.',
			},
		},
		tile: {
			attributes: {
				group: 'shape',
				state: 'active',
				introduced: '6.2.0',
				description: 'Use this specific radius token exclusively for the tile component system.',
			},
		},
	},
};
export default shape;
