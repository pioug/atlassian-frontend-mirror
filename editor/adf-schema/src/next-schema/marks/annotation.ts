import type {
	ADFMark,
	ADFMarkGroup,
	ADFMarkSpec,
} from '@atlaskit/adf-schema-generator';
import {
	MarkExcludesNone,
	adfMark,
	adfMarkGroup,
} from '@atlaskit/adf-schema-generator';

export const annotation: ADFMark<ADFMarkSpec> = adfMark('annotation');
export const annotationGroup: ADFMarkGroup = adfMarkGroup('annotation', [
	annotation,
]);

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
