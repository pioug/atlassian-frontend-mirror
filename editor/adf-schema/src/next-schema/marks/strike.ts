import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import { adfMark } from '@atlaskit/adf-schema-generator';

export const strike: ADFMark<ADFMarkSpec> = adfMark('strike').define({
	inclusive: true,
});
