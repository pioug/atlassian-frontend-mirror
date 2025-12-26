import type { JSONSchema4 } from 'json-schema';
import {
	$onePlus,
	$or,
	$zeroPlus,
	adfMark,
	adfMarkGroup,
	adfNode,
	adfNodeGroup,
} from '../../index';

export const getTestAdfNode = () => {
	const em = adfMark('em').define({
		inclusive: true,
	});
	const strong = adfMark('strong').define({
		inclusive: true,
	});
	const fontStyleGroup = adfMarkGroup('fontStyle', [em, strong]);
	const alignment = adfMark('alignment');
	const indentation = adfMark('indentation');
	const indentationMarkExclusionGroup = adfMarkGroup('indentation', [indentation]);
	alignment.define({
		excludes: [indentationMarkExclusionGroup],
		attrs: {
			align: { type: 'enum', values: ['center', 'end'], default: 'center' },
		},
	});
	const annotation = adfMark('annotation').define({
		inclusive: true,
		attrs: {
			id: { type: 'string', default: '' },
			annotationType: {
				type: 'enum',
				values: ['inlineComment'],
				default: 'inlineComment',
			},
		},
	});
	const code = adfMark('code').define({
		excludes: [fontStyleGroup],
		inclusive: true,
	});

	const emoji = adfNode('emoji').define({
		inline: true,
		selectable: true,
		attrs: {
			shortName: { type: 'string', default: '' },
			id: { type: 'string', default: '', optional: true },
			text: { type: 'string', default: '', optional: true },
		},
	});

	const text = adfNode('text')
		.define({})
		.variant('code_inline', {
			marks: [code, annotation],
		});
	const placeholder = adfNode('placeholder').define({
		inline: true,
		allowNoChildMark: true,
	});
	const hardBreak = adfNode('hardBreak').define({
		inline: true,
		selectable: false,
		linebreakReplacement: true,
	});
	const inlineGroup = adfNodeGroup('inline', [
		text.use('code_inline')!,
		emoji,
		placeholder,
		hardBreak,
	]);
	const paragraph = adfNode('paragraph')
		.define({
			selectable: false,
			content: [$zeroPlus($or(inlineGroup))],
		})
		.variant('with_alignment', {
			marks: [alignment],
		})
		.variant('with_no_marks', {});
	const decisionList = adfNode('decisionList').define({
		selectable: false,
		allowAnyChildMark: true,
		content: [$onePlus($or(paragraph.use('with_alignment')!))],
	});
	const blockGroup = adfNodeGroup('block', [
		paragraph.use('with_alignment')!,
		paragraph.use('with_no_marks')!,
		decisionList,
	]);
	const blockRootOnlyGroup = adfNodeGroup('blockRootOnly');

	const testDoc = adfNode('testDoc').define({
		root: true,
		content: [$onePlus($or(blockGroup, blockRootOnlyGroup))],
	});
	return testDoc;
};

export const expectedNodeGroups: string[] = [
	'export type BlockDefinition = Array<ParagraphWithAlignmentDefinition|ParagraphWithNoMarksDefinition|DecisionListDefinition>',
	'export type InlineDefinition = Array<TextCodeInlineDefinition|EmojiDefinition|PlaceholderDefinition|HardBreakDefinition>',
	"import type { DecisionListDefinition, EmojiDefinition, HardBreakDefinition, ParagraphWithAlignmentDefinition, ParagraphWithNoMarksDefinition, PlaceholderDefinition, TextCodeInlineDefinition } from './nodeTypes'",
];

export const expectedNodes: string[] = [
	"import { createPMNodeSpecFactory } from '../../schema/createPMSpecFactory'",
	"import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model'",
	"import type { InlineDefinition, BlockDefinition, BlockRootOnlyDefinition } from './nodeGroupTypes'",
	"import type { AlignmentMark, AnnotationMark, CodeMark } from './markTypes'",
	"export interface DecisionListDefinition {type: 'decisionList',content: Array<ParagraphWithAlignmentDefinition>}",
	'export type DecisionListNode = PMNode & DecisionListDefinition',
	'export const decisionList = createPMNodeSpecFactory<DecisionListNode>({"content":"paragraph+","marks":"_","group":"block","selectable":false})',
	"export interface EmojiDefinition {type: 'emoji',attrs: {shortName: string;id?: string;text?: string},}",
	"export interface HardBreakDefinition {type: 'hardBreak'}",
	'export type EmojiNode = PMNode & EmojiDefinition',
	'export type HardBreakNode = PMNode & HardBreakDefinition',
	'export const emoji = createPMNodeSpecFactory<EmojiNode>({"group":"inline","inline":true,"attrs":{"shortName":{"default":""},"id":{"default":""},"text":{"default":""}},"selectable":true})',
	'export const hardBreak = createPMNodeSpecFactory<HardBreakNode>({"group":"inline","inline":true,"selectable":false,"linebreakReplacement":true})',
	"export interface ParagraphWithAlignmentDefinition {type: 'paragraph',content: Array<InlineDefinition>,marks: Array<AlignmentMark>}",
	'export type ParagraphWithAlignmentNode = PMNode & ParagraphWithAlignmentDefinition',
	'export const paragraphWithAlignment = createPMNodeSpecFactory<ParagraphWithAlignmentNode>({"content":"inline*","marks":"code annotation","group":"block","selectable":false})',
	"export interface ParagraphWithNoMarksDefinition {type: 'paragraph',content: Array<InlineDefinition>}",
	'export type ParagraphWithNoMarksNode = PMNode & ParagraphWithNoMarksDefinition',
	'export const paragraphWithNoMarks = createPMNodeSpecFactory<ParagraphWithNoMarksNode>({"content":"inline*","marks":"code annotation","group":"block","selectable":false})',
	"export interface PlaceholderDefinition {type: 'placeholder'}",
	'export type PlaceholderNode = PMNode & PlaceholderDefinition',
	'export const placeholder = createPMNodeSpecFactory<PlaceholderNode>({"marks":"","group":"inline","inline":true})',
	"export interface TestDocDefinition {type: 'testDoc',content: Array<BlockDefinition>}",
	'export type TestDocNode = PMNode & TestDocDefinition',
	'export const testDoc = createPMNodeSpecFactory<TestDocNode>({"content":"(block | blockRootOnly)+","marks":"alignment"})',
	"export interface TextCodeInlineDefinition {type: 'text',marks: Array<AnnotationMark|CodeMark>}",
	'export type TextCodeInlineNode = PMNode & TextCodeInlineDefinition',
	'export const textCodeInline = createPMNodeSpecFactory<TextCodeInlineNode>({"group":"inline"})',
];

export const expectedMarks: string[] = [
	"import { createPMMarkSpecFactory } from '../../schema/createPMSpecFactory'",
	"import type { Mark } from '@atlaskit/editor-prosemirror/model'",
	'export interface AlignmentMarkAttributes {align: "center"|"end"}',
	'export interface AlignmentDefinition {type: "alignment", attrs: AlignmentMarkAttributes}',
	'export interface AlignmentMark extends Mark {attrs: AlignmentMarkAttributes}',
	'export const alignment = createPMMarkSpecFactory<AlignmentMark>({"attrs":{"align":{"default":"center"}},"excludes":"indentation"})',
	'export interface AnnotationMarkAttributes {id: string;annotationType: "inlineComment"}',
	'export interface AnnotationDefinition {type: "annotation", attrs: AnnotationMarkAttributes}',
	'export interface AnnotationMark extends Mark {attrs: AnnotationMarkAttributes}',
	'export const annotation = createPMMarkSpecFactory<AnnotationMark>({"attrs":{"id":{"default":""},"annotationType":{"default":"inlineComment"}},"inclusive":true})',
	'export interface CodeDefinition {type: "code"}',
	'export type CodeMark = Mark',
	'export const code = createPMMarkSpecFactory({"inclusive":true,"excludes":"fontStyle"})',
];

export const expectedJSONDefinitions: JSONSchema4['definitions'] = {
	alignment_mark: {
		type: 'object',
		properties: {
			type: { enum: ['alignment'] },
			attrs: {
				type: 'object',
				properties: { align: { enum: ['center', 'end'] } },
				required: ['align'],
				additionalProperties: false,
			},
		},
		required: ['type', 'attrs'],
		additionalProperties: false,
	},
	annotation_mark: {
		type: 'object',
		properties: {
			type: { enum: ['annotation'] },
			attrs: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					annotationType: { enum: ['inlineComment'] },
				},
				required: ['id', 'annotationType'],
				additionalProperties: false,
			},
		},
		required: ['type', 'attrs'],
		additionalProperties: false,
	},
	block_node: {
		anyOf: [
			{ $ref: '#/definitions/paragraph_with_alignment_node' },
			{ $ref: '#/definitions/paragraph_with_no_marks_node' },
			{ $ref: '#/definitions/decisionList_node' },
		],
	},
	blockRootOnly_node: { anyOf: [] },
	code_inline_node: {
		allOf: [
			{ $ref: '#/definitions/text_node' },
			{
				type: 'object',
				properties: {
					marks: {
						type: 'array',
						items: {
							anyOf: [
								{ $ref: '#/definitions/code_mark' },
								{ $ref: '#/definitions/annotation_mark' },
							],
						},
					},
				},
				additionalProperties: true,
			},
		],
	},
	code_mark: {
		type: 'object',
		properties: { type: { enum: ['code'] } },
		required: ['type'],
		additionalProperties: false,
	},
	decisionList_node: {
		type: 'object',
		properties: {
			type: { enum: ['decisionList'] },
			content: {
				type: 'array',
				items: { $ref: '#/definitions/paragraph_with_alignment_node' },
				minItems: 1,
			},
		},
		additionalProperties: false,
		required: ['type', 'content'],
	},
	emoji_node: {
		type: 'object',
		properties: {
			type: { enum: ['emoji'] },
			attrs: {
				type: 'object',
				properties: {
					shortName: { type: 'string' },
					id: { type: 'string' },
					text: { type: 'string' },
				},
				required: ['shortName'],
				additionalProperties: false,
			},
		},
		additionalProperties: false,
		required: ['type', 'attrs'],
	},
	hardBreak_node: {
		type: 'object',
		properties: { type: { enum: ['hardBreak'] } },
		additionalProperties: false,
		required: ['type'],
	},
	inline_node: {
		anyOf: [
			{ $ref: '#/definitions/code_inline_node' },
			{ $ref: '#/definitions/emoji_node' },
			{ $ref: '#/definitions/placeholder_node' },
			{ $ref: '#/definitions/hardBreak_node' },
		],
	},
	paragraph_with_alignment_node: {
		allOf: [
			{ $ref: '#/definitions/paragraph_node' },
			{
				type: 'object',
				properties: {
					marks: {
						type: 'array',
						items: { $ref: '#/definitions/alignment_mark' },
					},
					content: {
						type: 'array',
						items: { $ref: '#/definitions/inline_node' },
					},
				},
				additionalProperties: true,
			},
		],
	},
	paragraph_with_no_marks_node: {
		allOf: [
			{ $ref: '#/definitions/paragraph_node' },
			{
				type: 'object',
				properties: {
					content: {
						type: 'array',
						items: { $ref: '#/definitions/inline_node' },
					},
				},
				additionalProperties: true,
			},
		],
	},
	placeholder_node: {
		type: 'object',
		properties: { type: { enum: ['placeholder'] } },
		additionalProperties: false,
		required: ['type'],
	},
	testDoc_node: {
		type: 'object',
		properties: {
			type: { enum: ['testDoc'] },
			content: {
				type: 'array',
				items: { $ref: '#/definitions/block_node' },
				minItems: 1,
			},
		},
		additionalProperties: false,
		required: ['type', 'content'],
	},
};
