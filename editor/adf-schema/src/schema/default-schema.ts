import { layoutSectionWithSingleColumn } from './nodes';
import { fragment } from './marks';
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
  | 'unsupportedMark'
  | 'unsupportedNodeAttribute'
  | 'typeAheadQuery'
  | 'dataConsumer';

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
      'unsupportedMark',
      'unsupportedNodeAttribute',
      'typeAheadQuery', // https://product-fabric.atlassian.net/browse/ED-10214,
    ],
  };
  return defaultSchemaConfig;
};

export const defaultSchemaConfig: SchemaConfig<
  DefaultSchemaNodes,
  DefaultSchemaMarks
> = getDefaultSchemaConfig();

export const getSchemaBasedOnStage = (stage = 'final') => {
  const defaultSchemaConfig = getDefaultSchemaConfig();
  if (stage === 'stage0') {
    defaultSchemaConfig.customNodeSpecs = {
      layoutSection: layoutSectionWithSingleColumn,
    };
    defaultSchemaConfig.customMarkSpecs = {
      fragment,
    };
    defaultSchemaConfig.nodes.push('mediaInline');
  }
  return createSchema(defaultSchemaConfig);
};

export const defaultSchema = getSchemaBasedOnStage();
