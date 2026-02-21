import type { ADFNode, ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator';
import { $or, $range, adfNode } from '@atlaskit/adf-schema-generator';
import { link } from '../marks/link';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { caption } from './caption';
import { media } from './media';
import { unsupportedBlock } from './unsupportedBlock';

export const mediaSingle: ADFNode<[string, 'caption', 'full', 'width_type'], ADFCommonNodeSpec> =
	adfNode('mediaSingle')
		.define({
			atom: true,
			selectable: true,
			marks: [link, unsupportedMark, unsupportedNodeAttribute],

			attrs: {
				anyOf: [
					{
						localId: { type: 'string', default: null, optional: true },
						width: {
							type: 'number',
							minimum: 0,
							maximum: 100,
							default: null,
							optional: true,
						},
						layout: {
							type: 'enum',
							values: [
								'wide',
								'full-width',
								'center',
								'wrap-right',
								'wrap-left',
								'align-end',
								'align-start',
							],
							default: 'center',
						},
						widthType: {
							type: 'enum',
							values: ['percentage'],
							default: 'percentage',
							optional: true,
						},
					},
					{
						localId: { type: 'string', default: null, optional: true },
						width: {
							type: 'number',
							minimum: 0,
							default: null,
						},
						widthType: {
							type: 'enum',
							values: ['pixel'],
							default: null,
						},
						layout: {
							type: 'enum',
							values: [
								'wide',
								'full-width',
								'center',
								'wrap-right',
								'wrap-left',
								'align-end',
								'align-start',
							],
							default: 'center',
						},
					},
				],
			},
			DANGEROUS_MANUAL_OVERRIDE: {
				'pm-spec': {
					content: {
						value: 'media|unsupportedBlock+|media unsupportedBlock+',
						reason:
							'The content expression is not correct or redundant around `media|media|unsupportedBlock+`. This case is not supported by the DSL.',
					},
					attrs: {
						value: { layout: { default: 'center' }, width: { default: null } },
						reason: 'the widthType was not in attrs of original spec',
					},
					marks: {
						value: 'annotation border link unsupportedMark unsupportedNodeAttribute',
						reason:
							"Types and PM Spec don't match, in types base mediaSingle doesn't have children, and in ADF DSL marks are derived from children",
					},
				},
				'validator-spec': {
					required: {
						remove: true,
						reason:
							'@DSLCompatibilityException - should be present in spec but removed for compatibility',
					},
				},
			},
		})
		.variant('caption', {
			atom: false,
			ignore: [],
			marks: [],

			contentMinItems: 1,
			contentMaxItems: 2,
			content: [$or(media, unsupportedBlock), $or(caption, unsupportedBlock)],

			DANGEROUS_MANUAL_OVERRIDE: {
				'pm-spec': {
					content: {
						value: 'media|unsupportedBlock+|media (caption|unsupportedBlock) unsupportedBlock*',
						reason:
							'The content expression is not correct or redundant around `media|media|unsupportedBlock+`. This case is not supported by the DSL.',
					},
					attrs: {
						value: {
							layout: { default: 'center' },
							width: { default: null },
						},
						reason: 'the widthType was not in attrs of original spec of mediaSingleWithCaption',
					},
				},
			},
		})
		.variant('full', {
			atom: false,
			content: [$range(1, 1, $or(media, unsupportedBlock))],
			ignore: [],
			marks: [],
			DANGEROUS_MANUAL_OVERRIDE: {
				'pm-spec': {
					content: {
						value: 'media|unsupportedBlock+|media (caption|unsupportedBlock) unsupportedBlock*',
						reason:
							'The content expression is not correct or redundant around `media|media|unsupportedBlock+`. This case is not supported by the DSL.',
					},
				},
			},
		})
		.variant('width_type', {
			content: [$range(1, 1, $or(media, unsupportedBlock))],
			// @DSLCompatibilityException - Generated JSON Schema does not have this.
			// We should introduce this to the JSON Schema since it is in PM Spec
			ignore: ['json-schema'],
			marks: [],
			DANGEROUS_MANUAL_OVERRIDE: {
				'pm-spec': {
					content: {
						value: 'media|unsupportedBlock+|media unsupportedBlock+',
						reason:
							'The content expression is not correct or redundant around `media|media|unsupportedBlock+`. This case is not supported by the DSL.',
					},
				},
			},
		});
