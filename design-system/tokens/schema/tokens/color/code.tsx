import type { AttributeSchema, CodeColorTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<CodeColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			code: {
				default: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for default text in code blocks and code diffs.',
					},
				},
				comments: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for comments in syntax-highlighted code.',
					},
				},
				operators: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for operators and punctuation in syntax-highlighted code.',
					},
				},
				keywords: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for language keywords in syntax-highlighted code.',
					},
				},
				strings: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for string values in syntax-highlighted code.',
					},
				},
				numbers: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for numeric values in syntax-highlighted code.',
					},
				},
				functions: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for functions in syntax-highlighted code.',
					},
				},
				tags: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for tags in syntax-highlighted code.',
					},
				},
				accent: {
					'1': {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '16.0.0',
							description: 'Use for an additional syntax-highlighting text color.',
						},
					},
					'2': {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '16.0.0',
							description: 'Use for an additional syntax-highlighting text color.',
						},
					},
				},
				gutter: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for line numbers and other code gutter text.',
					},
				},
			},
		},
		background: {
			code: {
				default: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for the default background of code blocks and code diffs.',
					},
				},
				gutter: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for the background of code gutters.',
					},
				},
				highlight: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '16.0.0',
						description: 'Use for highlighted unchanged code lines.',
					},
				},
				added: {
					highlight: {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '16.0.0',
							description: 'Use for highlighted added code lines.',
						},
					},
					line: {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '16.0.0',
							description: 'Use for added code lines.',
						},
					},
				},
				removed: {
					highlight: {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '16.0.0',
							description: 'Use for highlighted removed code lines.',
						},
					},
					line: {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '16.0.0',
							description: 'Use for removed code lines.',
						},
					},
				},
			},
		},
		border: {
			code: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '16.0.0',
					description: 'Use for code block and code diff borders.',
				},
			},
		},
	},
};

export default color;
