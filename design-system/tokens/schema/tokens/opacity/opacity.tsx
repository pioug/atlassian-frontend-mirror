import type { AttributeSchema, OpacityTokenSchema } from '../../../src/types';

const opacity: AttributeSchema<OpacityTokenSchema> = {
	opacity: {
		disabled: {
			attributes: {
				group: 'opacity',
				state: 'active',
				introduced: '0.10.13',
				description: `Apply to images when in a disabled state.`,
			},
		},
		loading: {
			attributes: {
				group: 'opacity',
				state: 'active',
				introduced: '0.10.13',
				description: `Apply to content that sits under a loading spinner.`,
			},
		},
	},
};

export default opacity;
