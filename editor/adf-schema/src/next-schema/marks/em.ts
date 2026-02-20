import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const em: ADFMark<ADFMarkSpec> = adfMark('em').define({
	inclusive: true,
});
