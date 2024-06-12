import type { AttributeSchema, FontFamilyTokenSchema } from '../../../src/types';
import type { FontFamilyBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: AttributeSchema<FontFamilyTokenSchema<BaseToken>> = {
	font: {
		family: {
			sans: {
				attributes: {
					group: 'fontFamily',
					state: 'deprecated',
					introduced: '0.10.33',
					description: 'Helpful guidance goes here',
					deprecated: '1.29.0',
				},
			},
			monospace: {
				attributes: {
					group: 'fontFamily',
					state: 'deprecated',
					introduced: '0.10.33',
					description: 'For representing code only.',
					deprecated: '1.29.0',
				},
			},
			code: {
				attributes: {
					group: 'fontFamily',
					state: 'active',
					introduced: '1.14.0',
					description: 'For representing code only.',
				},
			},
			brand: {
				heading: {
					attributes: {
						group: 'fontFamily',
						state: 'active',
						introduced: '1.14.0',
						description: 'For our brand heading text. Uses Charlie Display.',
					},
				},
				body: {
					attributes: {
						group: 'fontFamily',
						state: 'active',
						introduced: '1.14.0',
						description: 'For our brand body text. Uses Charlie Text.',
					},
				},
			},
			heading: {
				attributes: {
					group: 'fontFamily',
					state: 'active',
					introduced: '1.14.0',
					description: 'For our default product UI heading text.',
				},
			},
			body: {
				attributes: {
					group: 'fontFamily',
					state: 'active',
					introduced: '1.14.0',
					description: 'For our default product UI body text.',
				},
			},
		},
	},
};

export default font;
