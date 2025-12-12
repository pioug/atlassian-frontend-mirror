import { MarkExcludesNone, adfMark, adfMarkGroup } from '@atlaskit/adf-schema-generator';

export const annotation = adfMark('annotation');
export const annotationGroup = adfMarkGroup('annotation', [annotation]);

annotation.define({
	inclusive: true,
	excludes: MarkExcludesNone,
	group: annotationGroup,
	attrs: {
		id: { type: 'string', default: '' },
		annotationType: {
			type: 'enum',
			values: ['inlineComment'],
			default: 'inlineComment',
		},
	},
});
