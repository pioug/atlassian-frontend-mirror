import { customPanel } from './nodes/panel';
import { dataConsumer } from './marks/data-consumer';
import { createSchema, SchemaConfig } from './create-schema';
import { mediaSingleWithCaption } from './nodes';

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
  | 'typeAheadQuery';

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
      'mention',
      'media',
      'mediaGroup',
      'mediaSingle',
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
  // TODO: ED-10445 remove stage0 check after panels with emoji are on full schema AND image captions are on full schema
  if (stage === 'stage0') {
    defaultSchemaConfig.customNodeSpecs = {
      panel: customPanel,
      mediaSingle: mediaSingleWithCaption,
    };
    defaultSchemaConfig.customMarkSpecs = {
      dataConsumer: dataConsumer,
    };
    defaultSchemaConfig.nodes.push('caption');
  }
  return createSchema(defaultSchemaConfig);
};

export const defaultSchema = getSchemaBasedOnStage();
