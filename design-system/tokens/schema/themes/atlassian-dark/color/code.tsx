import type { CodeColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<CodeColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			code: {
				default: { value: 'DarkNeutral800' },
				comments: { value: 'DarkNeutral800' },
				operators: { value: 'DarkNeutral1000' },
				keywords: { value: 'Red300' },
				strings: { value: 'Lime300' },
				numbers: { value: 'Yellow300' },
				functions: { value: 'Green300' },
				tags: { value: 'Orange400' },
				accent: {
					'1': { value: 'Magenta300' },
					'2': { value: 'Blue300' },
				},
				gutter: { value: 'DarkNeutral700' },
			},
		},
		background: {
			code: {
				default: { value: 'DarkNeutral100' },
				gutter: { value: 'DarkNeutral200' },
				highlight: { value: 'DarkNeutral200' },
				added: {
					highlight: { value: 'Green1000' },
					line: { value: 'Green900' },
				},
				removed: {
					highlight: { value: 'Red1000' },
					line: { value: 'Red900' },
				},
			},
		},
		border: {
			code: { value: 'DarkNeutral300A' },
		},
	},
};

export default color;
