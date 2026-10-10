import { adfNodeGroup } from '@atlaskit/adf-schema-generator/adfNodeGroup';
import type { ADFNodeGroup } from '@atlaskit/adf-schema-generator/types/ADFNodeGroup';

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
