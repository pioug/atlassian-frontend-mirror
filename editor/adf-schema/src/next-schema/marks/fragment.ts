import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { MarkExcludesNone, adfMark } from '@atlaskit/adf-schema-generator';

export const fragment: ADFMark<ADFMarkSpec> = adfMark('fragment').define({
	inclusive: false,
	excludes: MarkExcludesNone,
	allowExcludesEmpty: true,
	attrs: {
		localId: { minLength: 1, type: 'string', default: '' },
		name: { type: 'string', default: null, optional: true },
	},
});
