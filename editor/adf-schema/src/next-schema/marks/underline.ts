import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const underline: ADFMark<ADFMarkSpec> = adfMark('underline').define({
	inclusive: true,
});
