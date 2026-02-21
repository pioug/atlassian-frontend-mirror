import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark, adfMarkGroup } from '@atlaskit/adf-schema-generator';

// These marks defined together because they form a cycle within the excludes.
export const alignment: ADFMark<ADFMarkSpec> = adfMark('alignment');
export const indentation: ADFMark<ADFMarkSpec> = adfMark('indentation');

const alignementMarkExclusionGroup = adfMarkGroup('alignment', [alignment]);

const indentationMarkExclusionGroup = adfMarkGroup('indentation', [indentation]);

alignment.define({
	excludes: [alignementMarkExclusionGroup, indentationMarkExclusionGroup],
	attrs: {
		align: { type: 'enum', values: ['center', 'end'] },
	},
});

indentation.define({
	excludes: [indentationMarkExclusionGroup, alignementMarkExclusionGroup],
	attrs: {
		level: { type: 'number', minimum: 1, maximum: 6 },
	},
});
