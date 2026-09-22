import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { defaultSchema, getSchemaBasedOnStage } from '../../../schema/default-schema';

const ANNOTATIONS_ON_EXTENSIONS_GATE = 'cc_maui_annotations_on_extensions';

describe('Default Schema', () => {
	describe('Nodes', () => {
		it('should contain the `mediaInline` node', () => {
			expect(defaultSchema.nodes.mediaInline).toBeDefined();
		});
	});

	describe('Marks', () => {
		it('should contain the `typeAheadQuery` mark', () => {
			expect(defaultSchema.marks.typeAheadQuery).toBeDefined();
		});

		it('should contain the `fragment` mark', () => {
			expect(defaultSchema.marks.fragment).toBeDefined();
		});
	});
});

describe('Get Schema Based On Stage', () => {
	describe('Default / Full Schema', () => {
		it('should contain the nodes', () => {
			const schema = getSchemaBasedOnStage();
			expect(Object.keys(schema.nodes)).toEqual([
				'doc',
				'paragraph',
				'text',
				'bulletList',
				'orderedList',
				'listItem',
				'heading',
				'blockquote',
				'codeBlock',
				'panel',
				'panel_c1',
				'rule',
				'image',
				'mention',
				'caption',
				'media',
				'mediaGroup',
				'mediaSingle',
				'mediaInline',
				'placeholder',
				'layoutSection',
				'layoutColumn',
				'hardBreak',
				'emoji',
				'table',
				'tableCell',
				'tableRow',
				'tableHeader',
				'confluenceJiraIssue',
				'confluenceUnsupportedInline',
				'confluenceUnsupportedBlock',
				'decisionList',
				'decisionItem',
				'taskList',
				'taskItem',
				'blockTaskItem',
				'date',
				'status',
				'expand',
				'nestedExpand',
				'extension',
				'inlineExtension',
				'bodiedExtension',
				'inlineCard',
				'blockCard',
				'embedCard',
				'syncBlock',
				'bodiedSyncBlock',
				'unknownBlock',
				'unsupportedBlock',
				'unsupportedInline',
			]);
		});

		it('should contain the marks', () => {
			const schema = getSchemaBasedOnStage();
			expect(Object.keys(schema.marks)).toEqual([
				'link',
				'em',
				'strong',
				'textColor',
				'backgroundColor',
				'strike',
				'subsup',
				'underline',
				'code',
				'typeAheadQuery',
				'alignment',
				'annotation',
				'confluenceInlineComment',
				'__colorGroupDeclaration',
				'__fontStyleGroupDeclaration',
				'__searchQueryGroupDeclaration',
				'__linkGroupDeclaration',
				'fontSize',
				'breakout',
				'dataConsumer',
				'fragment',
				'indentation',
				'border',
				'unsupportedMark',
				'unsupportedNodeAttribute',
			]);
		});
	});

	describe('Stage-0', () => {
		beforeEach(() => {
			getSchemaBasedOnStage.clear();
		});

		it('uses the base extension spec when extension annotations are disabled', () => {
			failGate(ANNOTATIONS_ON_EXTENSIONS_GATE);
			const schema = getSchemaBasedOnStage('stage0');

			expect(schema.nodes.extension.allowsMarkType(schema.marks.annotation)).toBe(false);
		});

		it('allows extension annotations when the gate is enabled', () => {
			passGate(ANNOTATIONS_ON_EXTENSIONS_GATE);
			const schema = getSchemaBasedOnStage('stage0');

			expect(schema.nodes.extension.allowsMarkType(schema.marks.annotation)).toBe(true);
		});

		it('uses the attribute-bearing root-only rule variant', () => {
			const schema = getSchemaBasedOnStage('stage0');

			expect(schema.nodes.rule.spec.attrs).toEqual({
				color: { default: null },
				localId: { default: null },
				style: { default: null },
				weight: { default: null },
			});
			expect(schema.nodes.rule.spec.marks).toBe(
				'breakout unsupportedMark unsupportedNodeAttribute',
			);
		});

		it('should contain the nodes', () => {
			const schema = getSchemaBasedOnStage('stage0');
			expect(Object.keys(schema.nodes)).toEqual([
				'doc',
				'paragraph',
				'text',
				'bulletList',
				'orderedList',
				'listItem',
				'heading',
				'blockquote',
				'codeBlock',
				'panel',
				'panel_c1',
				'rule',
				'bodiedRule',
				'image',
				'mention',
				'caption',
				'media',
				'mediaGroup',
				'mediaSingle',
				'mediaInline',
				'placeholder',
				'layoutSection',
				'layoutColumn',
				'hardBreak',
				'emoji',
				'table',
				'tableCell',
				'tableRow',
				'tableHeader',
				'confluenceJiraIssue',
				'confluenceUnsupportedInline',
				'confluenceUnsupportedBlock',
				'decisionList',
				'decisionItem',
				'taskList',
				'taskItem',
				'blockTaskItem',
				'date',
				'status',
				'expand',
				'nestedExpand',
				'extension',
				'inlineExtension',
				'bodiedExtension',
				'multiBodiedExtension',
				'extensionFrame',
				'inlineCard',
				'blockCard',
				'embedCard',
				'syncBlock',
				'bodiedSyncBlock',
				'unknownBlock',
				'unsupportedBlock',
				'unsupportedInline',
			]);
		});

		it('should contain the marks', () => {
			const schema = getSchemaBasedOnStage('stage0');
			expect(Object.keys(schema.marks)).toEqual([
				'link',
				'em',
				'strong',
				'textColor',
				'backgroundColor',
				'strike',
				'subsup',
				'underline',
				'code',
				'typeAheadQuery',
				'alignment',
				'annotation',
				'confluenceInlineComment',
				'__colorGroupDeclaration',
				'__fontStyleGroupDeclaration',
				'__searchQueryGroupDeclaration',
				'__linkGroupDeclaration',
				'fontSize',
				'breakout',
				'dataConsumer',
				'fragment',
				'indentation',
				'border',
				'unsupportedMark',
				'unsupportedNodeAttribute',
			]);
		});
	});
});
