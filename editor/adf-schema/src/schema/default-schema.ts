import type { MemoizedFn } from 'memoize-one';
import memoizeOne from 'memoize-one';

import type { Schema } from '@atlaskit/editor-prosemirror/model';

import type { SchemaConfig } from './create-schema';
import { createSchema } from './create-schema';
import {
	extensionFrame,
	layoutSectionWithSingleColumn,
	multiBodiedExtensionRootOnlyStage0,
	bodiedExtensionRootOnlyStage0,
	extensionRootOnlyStage0,
	expandWithNestedExpand,
	tableWithNestedTable,
	tableRowWithNestedTable,
	tableCellWithNestedTableStage0,
	tableHeaderWithNestedTableStage0,
} from './nodes';
import { bodiedRuleRootOnlyStage0 } from './nodes/bodied-rule';
import { extendedPanelC1RootOnlyStage0 } from './nodes/extended-panel-c1-root-only-stage0';
import { extendedPanelRootOnlyStage0 } from './nodes/extended-panel-root-only-stage0';
import { ruleWithAttrsRootOnlyStage0 } from './nodes/rule';

type DefaultSchemaNodes =
	| 'doc'
	| 'paragraph'
	| 'text'
	| 'bulletList'
	| 'orderedList'
	| 'listItem'
	| 'heading'
	| 'blockquote'
	| 'codeBlock'
	| 'panel'
	| 'panel_c1'
	| 'rule'
	| 'bodiedRule'
	| 'image'
	| 'mention'
	| 'media'
	| 'caption'
	| 'mediaGroup'
	| 'mediaSingle'
	| 'mediaInline'
	| 'confluenceUnsupportedBlock'
	| 'confluenceUnsupportedInline'
	| 'confluenceJiraIssue'
	| 'expand'
	| 'nestedExpand'
	| 'extension'
	| 'inlineExtension'
	| 'bodiedExtension'
	| 'hardBreak'
	| 'emoji'
	| 'table'
	| 'tableCell'
	| 'tableHeader'
	| 'tableRow'
	| 'decisionList'
	| 'decisionItem'
	| 'taskList'
	| 'taskItem'
	| 'blockTaskItem'
	| 'unknownBlock'
	| 'date'
	| 'status'
	| 'placeholder'
	| 'layoutSection'
	| 'layoutColumn'
	| 'inlineCard'
	| 'blockCard'
	| 'embedCard'
	| 'syncBlock'
	| 'bodiedSyncBlock'
	| 'unsupportedBlock'
	| 'unsupportedInline';

type DefaultSchemaMarks =
	| 'link'
	| 'em'
	| 'strong'
	| 'strike'
	| 'subsup'
	| 'underline'
	| 'code'
	| 'textColor'
	| 'backgroundColor'
	| 'confluenceInlineComment'
	| 'breakout'
	| 'alignment'
	| 'indentation'
	| 'annotation'
	| 'border'
	| 'fontSize'
	| 'unsupportedMark'
	| 'unsupportedNodeAttribute'
	| 'typeAheadQuery'
	| 'dataConsumer'
	| 'fragment';

const getDefaultSchemaConfig = (): SchemaConfig<DefaultSchemaNodes, DefaultSchemaMarks> => {
	const defaultSchemaConfig: SchemaConfig<DefaultSchemaNodes, DefaultSchemaMarks> = {
		nodes: [
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
			'caption',
			'mention',
			'media',
			'mediaGroup',
			'mediaSingle',
			'mediaInline',
			'confluenceUnsupportedBlock',
			'confluenceUnsupportedInline',
			'confluenceJiraIssue',
			'expand',
			'nestedExpand',
			'extension',
			'inlineExtension',
			'bodiedExtension',
			'hardBreak',
			'emoji',
			'table',
			'tableCell',
			'tableHeader',
			'tableRow',
			'decisionList',
			'decisionItem',
			'taskList',
			'taskItem',
			'blockTaskItem',
			'unknownBlock',
			'date',
			'status',
			'placeholder',
			'layoutSection',
			'layoutColumn',
			'inlineCard',
			'blockCard',
			'embedCard',
			'syncBlock',
			'bodiedSyncBlock',
			'unsupportedBlock',
			'unsupportedInline',
		],
		marks: [
			'link',
			'em',
			'strong',
			'strike',
			'subsup',
			'underline',
			'code',
			'textColor',
			'backgroundColor',
			'confluenceInlineComment',
			'breakout',
			'alignment',
			'indentation',
			'annotation',
			'fontSize',
			'dataConsumer',
			'border',
			'unsupportedMark',
			'unsupportedNodeAttribute',
			'typeAheadQuery', // https://product-fabric.atlassian.net/browse/ED-10214,
			'fragment',
		],
	};
	return defaultSchemaConfig;
};

export const defaultSchemaConfig: SchemaConfig<DefaultSchemaNodes, DefaultSchemaMarks> =
	getDefaultSchemaConfig();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSchemaBasedOnStage: MemoizedFn<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(this: any, stage?: any) => Schema<DefaultSchemaNodes, DefaultSchemaMarks>
> = memoizeOne(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(stage: any = 'final'): Schema<DefaultSchemaNodes, DefaultSchemaMarks> => {
		const defaultSchemaConfig = getDefaultSchemaConfig();
		if (stage === 'stage0') {
			defaultSchemaConfig.customNodeSpecs = {
				layoutSection: layoutSectionWithSingleColumn,
				extension: extensionRootOnlyStage0,
				bodiedExtension: bodiedExtensionRootOnlyStage0,
				multiBodiedExtension: multiBodiedExtensionRootOnlyStage0,
				extensionFrame: extensionFrame,
				expand: expandWithNestedExpand,
				table: tableWithNestedTable,
				tableRow: tableRowWithNestedTable,
				tableCell: tableCellWithNestedTableStage0,
				tableHeader: tableHeaderWithNestedTableStage0,
				panel: extendedPanelRootOnlyStage0(true),
				panel_c1: extendedPanelC1RootOnlyStage0(true),
				rule: ruleWithAttrsRootOnlyStage0,
				bodiedRule: bodiedRuleRootOnlyStage0,
			};
		}

		return createSchema(defaultSchemaConfig);
	},
);

export const defaultSchema: Schema<DefaultSchemaNodes, DefaultSchemaMarks> =
	getSchemaBasedOnStage();
