import { MarkExcludesNone, adfMark } from '@atlaskit/adf-schema-generator';

export const fragment = adfMark('fragment').define({
	inclusive: false,
	excludes: MarkExcludesNone,
	allowExcludesEmpty: true,
	attrs: {
		localId: { minLength: 1, type: 'string', default: '' },
		name: { type: 'string', default: null, optional: true },
	},
});
