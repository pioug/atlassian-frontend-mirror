import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';

export const rule: ADFNode<[string], ADFCommonNodeSpec> = adfNode('rule').define({
	attrs: { localId: { type: 'string', default: null, optional: true } },
});
