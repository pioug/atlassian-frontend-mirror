import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const strong: ADFMark<ADFMarkSpec> = adfMark('strong').define({
	inclusive: true,
});
