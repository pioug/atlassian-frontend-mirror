import { $or, $onePlus, adfNode } from '@atlaskit/adf-schema-generator';
import { blockGroup } from './groups/blockGroup';
import { layoutSection } from './nodes/layoutSection';
import { blockRootOnlyGroup } from './groups/blockRootOnlyGroup';
import { blockContentGroup } from './groups/blockContentGroup';
import { expand } from './nodes/expand';
import { codeBlock } from './nodes/codeBlock';
import { syncBlock } from './nodes/syncBlock';
import { bodiedSyncBlock } from './nodes/bodiedSyncBlock';
import type { ADFNode , ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator';

const doc: ADFNode<[string], ADFCommonNodeSpec> = adfNode('doc').define({
	root: true,
	version: 1,
	content: [
		$onePlus(
			$or(
				blockGroup,
				blockContentGroup,
				codeBlock.use('root_only'),
				layoutSection,
				layoutSection.use('with_single_column'),
				layoutSection.use('full'),
				blockRootOnlyGroup,
				expand.use('root_only'),
				syncBlock,
				bodiedSyncBlock,
			),
		),
	],
	DANGEROUS_MANUAL_OVERRIDE: {
		'validator-spec': {
			'props.content.minItems': {
				remove: true,
				reason:
					"@DSLCompatibilityException - The content expression and minItems don't match in the current validator schema.",
			},
		},
	},
});

export default doc;
