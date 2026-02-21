import type { MemoizedFn } from 'memoize-one';
import memoizeOne from 'memoize-one';

import {
	extensionFrame,
	layoutSectionWithSingleColumn,
	multiBodiedExtension,
	expandWithNestedExpand,
	tableWithNestedTable,
	listItemWithDecisionStage0,
	tableRowWithNestedTable,
	tableCellWithNestedTable,
	tableHeaderWithNestedTable,
} from './nodes';
import type { SchemaConfig } from './create-schema';
import { createSchema } from './create-schema';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

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
	| 'rule'
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
				multiBodiedExtension: multiBodiedExtension,
				extensionFrame: extensionFrame,
				expand: expandWithNestedExpand,
				listItem: listItemWithDecisionStage0,
				table: tableWithNestedTable,
				tableRow: tableRowWithNestedTable,
				tableCell: tableCellWithNestedTable,
				tableHeader: tableHeaderWithNestedTable,
			};
		}

		return createSchema(defaultSchemaConfig);
	},
);

export const defaultSchema: Schema<DefaultSchemaNodes, DefaultSchemaMarks> =
	getSchemaBasedOnStage();
