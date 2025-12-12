import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { extensionFrame } from './extensionFrame';

export const multiBodiedExtension = adfNode('multiBodiedExtension').define({
	stage0: true,

	definingAsContext: true,
	selectable: true,

	// Marks don't make it into the PM node spec, as they get overridden by the marks in
	// packages/adf-schema-generator/src/transforms/adfToPm/buildPmSpec.ts
	marks: [unsupportedNodeAttribute, unsupportedMark],
	hasEmptyMarks: true,
	marksMaxItems: 0,

	attrs: {
		extensionKey: { type: 'string', default: '', minLength: 1 },
		extensionType: { type: 'string', default: '', minLength: 1 },
		parameters: { type: 'object', optional: true, default: null },
		text: { type: 'string', optional: true, default: null },
		layout: {
			type: 'enum',
			values: ['default', 'wide', 'full-width'],
			optional: true,
			default: 'default',
		},
		localId: { type: 'string', optional: true, default: null, minLength: 1 },
	},
	content: [$onePlus($or(extensionFrame))],

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
