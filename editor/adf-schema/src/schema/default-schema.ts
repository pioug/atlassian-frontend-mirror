import memoizeOne from 'memoize-one';

import {
  mediaSingleFull,
  layoutSectionWithSingleColumn,
  tableWithCustomWidth,
} from './nodes';
import { createSchema, SchemaConfig } from './create-schema';

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
  | 'unknownBlock'
  | 'date'
  | 'status'
  | 'placeholder'
  | 'layoutSection'
  | 'layoutColumn'
  | 'inlineCard'
  | 'blockCard'
  | 'embedCard'
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

const getDefaultSchemaConfig = (): SchemaConfig<
  DefaultSchemaNodes,
  DefaultSchemaMarks
> => {
  let defaultSchemaConfig: SchemaConfig<
    DefaultSchemaNodes,
    DefaultSchemaMarks
  > = {
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
      'unknownBlock',
      'date',
      'status',
      'placeholder',
      'layoutSection',
      'layoutColumn',
      'inlineCard',
      'blockCard',
      'embedCard',
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

export const defaultSchemaConfig: SchemaConfig<
  DefaultSchemaNodes,
  DefaultSchemaMarks
> = getDefaultSchemaConfig();

export const getSchemaBasedOnStage = memoizeOne((stage = 'final') => {
  const defaultSchemaConfig = getDefaultSchemaConfig();
  if (stage === 'stage0') {
    defaultSchemaConfig.customNodeSpecs = {
      layoutSection: layoutSectionWithSingleColumn,
      table: tableWithCustomWidth,
      mediaSingle: mediaSingleFull,
    };
  }

  return createSchema(defaultSchemaConfig);
});

export const defaultSchema = getSchemaBasedOnStage();
