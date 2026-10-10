import { adfMark, type ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import {
	MarkExcludesNone,
	type ADFMarkSpec,
} from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const fragment: ADFMark<ADFMarkSpec> = adfMark('fragment').define({
	inclusive: false,
	excludes: MarkExcludesNone,
	allowExcludesEmpty: true,
	attrs: {
		localId: { minLength: 1, type: 'string', default: '' },
		name: { type: 'string', default: null, optional: true },
	},
});
