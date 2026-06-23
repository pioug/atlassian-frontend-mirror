import { $or, $onePlus, adfNode } from '@atlaskit/adf-schema-generator';
import { blockGroup } from './groups/blockGroup';
import { layoutSection } from './nodes/layoutSection';
import { blockRootOnlyGroup } from './groups/blockRootOnlyGroup';
import { blockContentGroup } from './groups/blockContentGroup';
import { expand } from './nodes/expand';
import { codeBlock } from './nodes/codeBlock';
import { syncBlock } from './nodes/syncBlock';
import { bodiedSyncBlock } from './nodes/bodiedSyncBlock';
import type { ADFNode, ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator';
import { panel } from './nodes/panel';
import { rule } from './nodes/rule';
import { table } from './nodes/tableNodes';

// Wire cross-container content after all node modules are fully evaluated,
// so neither import is undefined when the $or() expression is constructed.
panel.use('c1').addContent(table);
panel.use('c1_root_only').addContent(table);

const doc: ADFNode<[string], ADFCommonNodeSpec> = adfNode('doc').define({
	root: true,
	version: 1,
	content: [
		$onePlus(
			$or(
				blockGroup,
				blockContentGroup,
				codeBlock.use('root_only'),
				panel.use('root_only'),
				rule.use('root_only'),
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
