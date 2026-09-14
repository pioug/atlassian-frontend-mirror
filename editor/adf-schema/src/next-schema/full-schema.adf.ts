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
import { bodiedExtension } from './nodes/bodiedExtension';
import { extension } from './nodes/extension';
import { multiBodiedExtension } from './nodes/multiBodiedExtension';
import { panel } from './nodes/panel';
import { rule } from './nodes/rule';
import { bodiedRule } from './nodes/bodiedRule';

const doc: ADFNode<[string], ADFCommonNodeSpec> = adfNode('doc').define({
	root: true,
	version: 1,
	content: [
		$onePlus(
			$or(
				blockGroup,
				// `panel.use('c1')` must precede `blockContentGroup`, which contributes the bare `panel`
				// name to the validator spec. The validator's repairing loop takes the FIRST candidate that
				// reports valid, and with a repairing callback the less permissive base `panel` "succeeds"
				// by wrapping a nested table as `unsupportedBlock`, so `panel_c1` is never reached.
				// Safe because panel_c1's content is a strict superset of the base's (it only adds `table`).
				// Deliberately placed AFTER `blockGroup` rather than first: `blockContentGroup` is ignored
				// for `pm-spec`, so this keeps `block` the leading alternative in the PM content
				// expression and leaves ProseMirror's defaultType/fill behaviour untouched.
				panel.use('c1'),
				blockContentGroup,
				codeBlock.use('root_only'),
				panel.use('root_only'),
				panel.use('c1_root_only'),
				rule.use('root_only'),
				rule.use('with_attrs_root_only'),
				bodiedRule.use('root_only'),
				extension.use('root_only'),
				bodiedExtension.use('root_only'),
				multiBodiedExtension.use('root_only'),
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
