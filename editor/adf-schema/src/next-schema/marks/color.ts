import type {
	ADFMark,
	ADFMarkGroup,
	ADFMarkSpec,
} from '@atlaskit/adf-schema-generator';
import { adfMark, adfMarkGroup } from '@atlaskit/adf-schema-generator';

export const backgroundColor: ADFMark<ADFMarkSpec> = adfMark('backgroundColor');
export const textColor: ADFMark<ADFMarkSpec> = adfMark('textColor');

export const colorGroup: ADFMarkGroup = adfMarkGroup('color', [
	textColor,
	backgroundColor,
]);

backgroundColor.define({
	inclusive: true,
	excludes: [colorGroup],
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
