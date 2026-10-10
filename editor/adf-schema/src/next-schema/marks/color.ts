import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMarkGroup } from '@atlaskit/adf-schema-generator/adfMarkGroup';
import type { ADFMarkGroup } from '@atlaskit/adf-schema-generator/types/ADFMarkGroup';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const backgroundColor: ADFMark<ADFMarkSpec> = adfMark('backgroundColor');
export const textColor: ADFMark<ADFMarkSpec> = adfMark('textColor');

export const colorGroup: ADFMarkGroup = adfMarkGroup('color', [textColor, backgroundColor]);

backgroundColor.define({
	inclusive: true,
	attrs: {
		color: {
			pattern: '^#[0-9a-fA-F]{6}$',
			type: 'string',
		},
	},
});

textColor.define({
	inclusive: true,
	attrs: {
		color: {
			type: 'string',
			pattern: '^#[0-9a-fA-F]{6}$',
		},
	},
});
