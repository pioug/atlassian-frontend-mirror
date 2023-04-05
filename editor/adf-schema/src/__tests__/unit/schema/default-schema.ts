import {
  defaultSchema,
  getSchemaBasedOnStage,
} from '../../../../src/schema/default-schema';

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
        'breakout',
        'dataConsumer',
        'fragment',
        'indentation',
        'unsupportedMark',
        'unsupportedNodeAttribute',
      ]);
    });
  });

  describe('Stage-0', () => {
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
