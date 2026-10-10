import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMarkGroup } from '@atlaskit/adf-schema-generator/adfMarkGroup';
import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator/types/ADFMarkGroup';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';
import { MarkExcludesNone } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const annotation: ADFMark<ADFMarkSpec> = adfMark('annotation');
export const annotationGroup: ADFMarkGroup = adfMarkGroup('annotation', [annotation]);

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
