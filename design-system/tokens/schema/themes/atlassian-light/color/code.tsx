import type { CodeColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<CodeColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			code: {
				default: { value: 'Neutral800' },
				comments: { value: 'Neutral800' },
				operators: { value: 'Neutral1000' },
				keywords: { value: 'Red800' },
				strings: { value: 'Lime800' },
				numbers: { value: 'Yellow800' },
				functions: { value: 'Green800' },
				tags: { value: 'Orange800' },
				accent: {
					'1': { value: 'Magenta800' },
					'2': { value: 'Blue800' },
				},
				gutter: { value: 'Neutral700' },
			},
		},
		background: {
			code: {
				default: { value: 'Neutral0' },
				gutter: { value: 'Neutral200' },
				highlight: { value: 'Neutral200' },
				added: {
					highlight: { value: 'Green100' },
					line: { value: 'Green200A40' },
				},
				removed: {
					highlight: { value: 'Red100' },
					line: { value: 'Red200A40' },
				},
			},
		},
		border: {
			code: { value: 'Neutral300A' },
		},
	},
};

export default color;
