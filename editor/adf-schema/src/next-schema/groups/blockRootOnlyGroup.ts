import type { ADFNodeGroup } from '@atlaskit/adf-schema-generator';
import { adfNodeGroup } from '@atlaskit/adf-schema-generator';
import { multiBodiedExtension } from '../nodes/multiBodiedExtension';

export const blockRootOnlyGroup: ADFNodeGroup = adfNodeGroup(
	'blockRootOnly',
	[multiBodiedExtension],
	{
		// @DSLCompatibilityException - Generated JSON Schema does not have this.
		// We should introduce this to the JSON Schema since it is in PM Spec
		ignore: ['json-schema'],
	},
);
