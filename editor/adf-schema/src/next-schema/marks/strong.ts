import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const strong: ADFMark<ADFMarkSpec> = adfMark('strong').define({
	inclusive: true,
});
